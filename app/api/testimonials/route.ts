import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { TestimonialStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const approvalStatus = searchParams.get("approvalStatus");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const sort = searchParams.get("sort");
    const includeAll = searchParams.get("includeAll"); // For admin to see all

    const where: Record<string, unknown> = {};

    // For public API, only show APPROVED testimonials unless admin requests all
    if (includeAll !== "true") {
      // If status=ACTIVE is passed from old code, treat as APPROVED
      if (status === "ACTIVE") {
        where.status = "APPROVED";
      } else if (approvalStatus) {
        where.status = approvalStatus;
      } else {
        // Default: show only approved for public
        where.status = "APPROVED";
      }
    }

    if (featured === "true") where.featured = true;

    // Handle sorting
    let orderBy: any = [{ featured: "desc" }, { createdAt: "desc" }];
    if (sort === "newest") {
      orderBy = [{ createdAt: "desc" }];
    }

    const take = limit ? parseInt(limit) : undefined;
    const skip = page && take ? (parseInt(page) - 1) * take : undefined;

    // Get testimonials with pagination
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy,
        take,
        skip,
      }),
      prisma.testimonial.count({ where }),
    ]);

    const totalPages = take ? Math.ceil(total / take) : 1;
    const currentPage = page ? parseInt(page) : 1;

    return NextResponse.json({
      testimonials,
      total,
      page: currentPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST create testimonial - PUBLIC (for user submissions) or ADMIN
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      location,
      rating,
      comment,
      image,
      featured,
      status,
      packageId,
      tripDate,
      isAdmin, // Flag to indicate admin submission
    } = body;

    // Check if admin submission
    const session = await getServerSession(authOptions);
    const isAdminUser = session?.user?.role === "ADMIN";

    // Validation
    if (!name || !comment) {
      return NextResponse.json(
        { error: "Name and comment are required" },
        { status: 400 }
      );
    }

    // Determine initial status
    // Admin submissions can set any status, public submissions start as PENDING
    let testimonialStatus: TestimonialStatus = TestimonialStatus.PENDING;
    if (isAdminUser && (isAdmin || status)) {
      testimonialStatus =
        (status as TestimonialStatus) || TestimonialStatus.APPROVED;
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        email: email || null,
        location: location || "",
        rating: parseInt(rating) || 5,
        comment,
        image: image || null,
        packageId: packageId || null,
        tripDate: tripDate || null,
        featured: isAdminUser ? featured || false : false,
        status: testimonialStatus,
      },
    });

    // Revalidate paths to update cache
    revalidatePath("/");

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

// PUT update testimonial status (for admin approval/rejection)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, verified, featured } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Testimonial ID and status are required" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        status: status as TestimonialStatus,
        featured: featured !== undefined ? featured : false,
      },
    });

    // Revalidate paths to update cache
    revalidatePath("/");

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
