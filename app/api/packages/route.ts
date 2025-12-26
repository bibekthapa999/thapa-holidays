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
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

    const packages = await prisma.package.findMany({
      where,
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      ...(limit ? { take: parseInt(limit) } : {}),
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
        accommodations: accommodations || null,
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
