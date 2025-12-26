import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// GET reviews for a specific package
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const includeAll = searchParams.get("includeAll"); // For admin

    if (!packageId && includeAll !== "true") {
      return NextResponse.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};
    if (packageId) {
      where.packageId = packageId;
    }

    // For public API, only show APPROVED reviews unless admin requests all
    if (includeAll !== "true") {
      where.status = "APPROVED";
    } else if (status) {
      where.status = status;
    }

    const take = limit ? parseInt(limit) : 10;
    const skip = page && take ? (parseInt(page) - 1) * take : undefined;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        take,
        skip,
        select: {
          id: true,
          name: true,
          location: true,
          rating: true,
          title: true,
          comment: true,
          images: true,
          verified: true,
          helpful: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);

    return NextResponse.json({
      reviews,
      total,
      page: page ? parseInt(page) : 1,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, name, email, location, rating, title, comment, images } =
      body;

    if (!packageId || !name || !comment) {
      return NextResponse.json(
        { error: "Package ID, name, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if package exists
    const packageExists = await prisma.package.findUnique({
      where: { id: packageId },
      select: { id: true, status: true },
    });

    if (!packageExists || packageExists.status !== "ACTIVE") {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        packageId,
        name,
        email,
        location,
        rating,
        title,
        comment,
        images: images || [],
        status: "PENDING", // All reviews start as pending for approval
      },
    });

    // Update package review count and rating
    await updatePackageReviewStats(packageId);

    // Revalidate paths to update cache
    revalidatePath(`/packages/${packageId}`);

    return NextResponse.json({
      review,
      message: "Review submitted successfully and is pending approval",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// PUT update review status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, verified } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Review ID and status are required" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        status: status as ReviewStatus,
        verified: verified !== undefined ? verified : false,
      },
    });

    // Update package review stats if status changed
    if (status === "APPROVED" || status === "REJECTED") {
      await updatePackageReviewStats(review.packageId);
    }

    // Revalidate paths to update cache
    revalidatePath(`/packages/${review.packageId}`);

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// PATCH update review helpful count
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "Review ID and action are required" },
        { status: 400 }
      );
    }

    if (action !== "helpful") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Increment helpful count
    const review = await prisma.review.update({
      where: { id },
      data: {
        helpful: {
          increment: 1,
        },
      },
      select: {
        id: true,
        helpful: true,
      },
    });

    // Revalidate paths to update cache
    const reviewData = await prisma.review.findUnique({
      where: { id },
      select: { packageId: true },
    });
    if (reviewData) {
      revalidatePath(`/packages/${reviewData.packageId}`);
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error updating review helpful count:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE review (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
      select: { packageId: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({
      where: { id },
    });

    // Update package review stats
    await updatePackageReviewStats(review.packageId);

    // Revalidate paths to update cache
    revalidatePath(`/packages/${review.packageId}`);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

// Helper function to update package review statistics
async function updatePackageReviewStats(packageId: string) {
  try {
    const approvedReviews = await prisma.review.findMany({
      where: {
        packageId,
        status: "APPROVED",
      },
      select: { rating: true },
    });

    const reviewCount = approvedReviews.length;
    const averageRating =
      reviewCount > 0
        ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        : 0;

    await prisma.package.update({
      where: { id: packageId },
      data: {
        reviews: reviewCount,
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      },
    });
  } catch (error) {
    console.error("Error updating package review stats:", error);
  }
}
