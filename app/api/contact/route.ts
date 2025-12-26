import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";

// GET all contact inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const contacts = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact inquiries" },
      { status: 500 }
    );
  }
}

// POST create contact inquiry (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      subject,
      message,
      type = "CONTACT",
      // Travel consultation fields
      destination,
      travelDate,
      travelers,
      budget,
      hotelType,
      groupSize,
      specialRequirements,
    } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || "Travel Consultation",
        message,
        type,
        destination: destination || null,
        travelDate: travelDate || null,
        travelers: travelers || null,
        budget: budget || null,
        hotelType: hotelType || null,
        groupSize: groupSize || null,
        specialRequirements: specialRequirements || null,
        status: "NEW",
      },
    });

    // Send email notifications
    try {
      await sendContactEmail({
        name,
        email,
        phone,
        message,
        destination,
        travelDate,
        hotelType,
        groupSize,
        budget,
        specialRequirements,
        type,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry! We will get back to you soon.",
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to submit your inquiry. Please try again." },
      { status: 500 }
    );
  }
}
