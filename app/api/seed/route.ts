import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 200 }
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@thapaholidays.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // Create default site settings
    await prisma.siteSettings.create({
      data: {
        companyName: "Thapa Holidays",
        tagline: "Discover Amazing Places",
        phone: "+91 9002660557",
        phone2: "+91 8617410057",
        whatsapp: "+919002660557",
        email: "thapa.holidays09@gmail.com",
        supportEmail: "thapa.holidays09@gmail.com",
        address:
          "Vastu Vihar, Near Steel Factory, Panchkulgari\nP.O. Matigara, Dist Darjeeling, Pin: 734010",
        emergencyPhone: "+91 9002660557",
        website: "https://thapaholidays.com",
        description:
          "Your trusted travel partner for over 15 years. We create unforgettable experiences and help you discover the incredible beauty of India and beyond.",
        facebook: "https://facebook.com/thapaholidays",
        instagram: "https://instagram.com/thapaholidays",
        twitter: "https://twitter.com/thapaholidays",
        youtube: "https://youtube.com/thapaholidays",
      },
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      email: admin.email,
      defaultPassword: "admin123",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
