import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// POST duplicate package
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the original package
    const originalPackage = await prisma.package.findUnique({
      where: { id },
      include: {
        accommodations: true,
      },
    });

    if (!originalPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Create slug for duplicated package
    const baseSlug = originalPackage.slug;
    let newSlug = `${baseSlug}-copy`;
    let counter = 1;

    // Check if slug exists and increment counter if needed
    while (await prisma.package.findUnique({ where: { slug: newSlug } })) {
      counter++;
      newSlug = `${baseSlug}-copy-${counter}`;
    }

    // Create the duplicated package with INACTIVE status
    const duplicatedPackage = await prisma.package.create({
      data: {
        name: `${originalPackage.name} (Copy)`,
        slug: newSlug,
        destinationId: originalPackage.destinationId,
        destinationName: originalPackage.destinationName,
        location: originalPackage.location,
        country: originalPackage.country,
        image: originalPackage.image,
        images: originalPackage.images,
        price: originalPackage.price,
        originalPrice: originalPackage.originalPrice,
        duration: originalPackage.duration,
        groupSize: originalPackage.groupSize,
        rating: originalPackage.rating,
        reviews: originalPackage.reviews,
        description: originalPackage.description,
        highlights: originalPackage.highlights,
        inclusions: originalPackage.inclusions,
        exclusions: originalPackage.exclusions,
        itinerary: originalPackage.itinerary as any,
        faqs: originalPackage.faqs as any,
        policies: originalPackage.policies as any,
        bestTime: originalPackage.bestTime,
        difficulty: originalPackage.difficulty,
        type: originalPackage.type,
        badge: originalPackage.badge,
        featured: false, // Set to false for draft
        status: "INACTIVE", // Set to INACTIVE so it's not published
        accommodations: {
          connect: originalPackage.accommodations.map((acc) => ({
            id: acc.id,
          })),
        },
      },
    });

    // Revalidate paths to update cache
    revalidatePath("/");
    revalidatePath("/packages");

    return NextResponse.json(duplicatedPackage, { status: 201 });
  } catch (error) {
    console.error("Error duplicating package:", error);
    return NextResponse.json(
      { error: "Failed to duplicate package" },
      { status: 500 }
    );
  }
}
