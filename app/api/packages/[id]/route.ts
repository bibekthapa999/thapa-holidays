import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET single package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const packageData = await prisma.package.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        destination: true,
      },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

// PUT update package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Map frontend fields to schema fields
    if (body.faq !== undefined) body.faqs = body.faq;
    if (body.policy !== undefined) body.policies = body.policy;
    delete body.faq;
    delete body.policy;

    // Handle destination relation
    if (body.destination) {
      body.destinationId = body.destination.id;
      delete body.destination;
    }

    // Parse numeric fields
    if (body.price) body.price = parseFloat(body.price);
    if (body.originalPrice) body.originalPrice = parseFloat(body.originalPrice);

    const packageData = await prisma.package.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    // Revalidate paths to update cache
    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath(`/packages/${packageData.slug}`);

    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

// DELETE package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.package.delete({
      where: { id },
    });

    // Revalidate paths to update cache
    revalidatePath("/");
    revalidatePath("/packages");

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
