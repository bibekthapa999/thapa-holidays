import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";

// POST create package enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      packageId,
      packageName,
      travelDate,
      travelTime,
      adults,
      children,
      rooms,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Create enquiry
    const enquiry = await prisma.packageEnquiry.create({
      data: {
        name,
        email,
        phone,
        packageId: packageId || null,
        packageName: packageName || null,
        travelDate: travelDate ? new Date(travelDate) : null,
        travelTime: travelTime || null,
        adults: parseInt(adults) || 1,
        children: parseInt(children) || 0,
        rooms: parseInt(rooms) || 1,
        message: message || null,
        status: "NEW",
      },
    });

    // Send email notifications
    try {
      const emailMessage = `Package Enquiry Details:
Package: ${packageName || "Not specified"}
Travel Date: ${
        travelDate
          ? new Date(travelDate).toLocaleDateString("en-IN")
          : "Not specified"
      }
Travel Time: ${travelTime || "Not specified"}
Adults: ${adults || 1}
Children: ${children || 0}
Rooms: ${rooms || 1}
Message: ${message || "No additional message"}`;

      await sendContactEmail({
        name,
        email,
        phone,
        message: emailMessage,
        destination: packageName,
        travelDate,
        groupSize: `${adults || 1} adults${
          children ? `, ${children} children` : ""
        }`,
        specialRequirements: message,
        type: "PACKAGE_ENQUIRY",
      });
    } catch (emailError) {
      console.error("Error sending package enquiry email:", emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating package enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

// GET all package enquiries (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const packageId = searchParams.get("packageId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (packageId) where.packageId = packageId;

    const enquiries = await prisma.packageEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            destinationName: true,
          },
        },
      },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Error fetching package enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
