import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET all packages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const destinationId = searchParams.get("destinationId");
    const destination = searchParams.get("destination");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = searchParams.get("limit");

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (featured === "true") where.featured = true;
    if (destinationId) where.destinationId = destinationId;
    if (destination)
      where.destinationName = { contains: destination, mode: "insensitive" };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) where.price.gte = min;
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) where.price.lte = max;
      }
    }

    const packages = await prisma.package.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        destinationId: true,
        destinationName: true,
        location: true,
        country: true,
        image: true,
        images: true,
        price: true,
        originalPrice: true,
        duration: true,
        groupSize: true,
        rating: true,
        reviews: true,
        description: true,
        highlights: true,
        inclusions: true,
        exclusions: true,
        bestTime: true,
        difficulty: true,
        type: true,
        badge: true,
        featured: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      ...(limit && !isNaN(parseInt(limit)) ? { take: parseInt(limit) } : {}),
    });

    // Map destination name for frontend
    const mappedPackages = packages.map((pkg) => ({
      ...pkg,
      destinationName:
        pkg.destination?.name || pkg.destinationName || "Unknown",
    }));

    return NextResponse.json(mappedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST create package
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      destinationId,
      destinationName,
      location,
      country,
      image,
      images,
      price,
      originalPrice,
      duration,
      groupSize,
      description,
      highlights,
      inclusions,
      exclusions,
      itinerary,
      accommodations,
      faq,
      policy,
      bestTime,
      difficulty,
      type,
      badge,
      featured,
      status,
    } = body;

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug exists
    const existingPackage = await prisma.package.findUnique({
      where: { slug },
    });

    const finalSlug = existingPackage ? `${slug}-${Date.now()}` : slug;

    const packageData = await prisma.package.create({
      data: {
        name,
        slug: finalSlug,
        destinationId: destinationId || null,
        destinationName: destinationName || location,
        location,
        country: country || "India",
        image,
        images: images || [],
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        duration,
        groupSize,
        description,
        highlights: highlights || [],
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        itinerary: itinerary || null,
        faqs: faq || null,
        policies: policy || null,
        bestTime,
        difficulty: difficulty || "EASY",
        type: type || "PREMIUM",
        badge,
        featured: featured || false,
        status: status || "ACTIVE",
      },
    });

    // Create accommodations if provided
    if (accommodations && Array.isArray(accommodations)) {
      for (const acc of accommodations) {
        let accDestinationId = null;
        if (acc.destination) {
          accDestinationId = acc.destination.id;
        }

        await prisma.accommodation.create({
          data: {
            packageId: packageData.id,
            destinationId: accDestinationId,
            hotelName: acc.hotelName,
            roomType: acc.roomType,
            hotelCategory: acc.hotelCategory,
            nights: acc.nights || 1,
          },
        });
      }
    }

    // Revalidate paths to update cache
    revalidatePath("/");
    revalidatePath("/packages");

    return NextResponse.json(packageData, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
