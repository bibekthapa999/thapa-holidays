import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.siteSettings.create({
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
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          ...body,
          updatedAt: new Date(),
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: body,
      });
    }

    // Revalidate paths to update cache
    revalidatePath("/");

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
