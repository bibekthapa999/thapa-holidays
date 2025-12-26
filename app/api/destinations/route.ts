import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

// GET all destinations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const region = searchParams.get("region");
    const category = searchParams.get("category");

    const where: any = {};
    if (status) where.status = status;
    if (region) where.region = region;
    if (category) where.category = category;

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        _count: {
          select: { packages: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

// POST create destination
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      location,
      country,
      region,
      image,
      images,
      description,
      highlights,
      category,
      bestTime,
      status,
    } = body;

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug exists
    const existingDestination = await prisma.destination.findUnique({
      where: { slug },
    });

    const finalSlug = existingDestination ? `${slug}-${Date.now()}` : slug;

    const destination = await prisma.destination.create({
      data: {
        name,
        slug: finalSlug,
        location,
        country: country || "India",
        region: region || "INDIA",
        image,
        images: images || [],
        description,
        highlights: highlights || [],
        category: category || "MOUNTAIN",
        bestTime,
        status: status || "ACTIVE",
      },
    });

    // Revalidate paths to update cache
    revalidatePath("/");
    revalidatePath("/destinations");

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
