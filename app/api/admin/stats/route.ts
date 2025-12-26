import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts
    const [
      totalPackages,
      totalDestinations,
      totalEnquiries,
      totalBlogPosts,
      newEnquiries,
      pendingReviews,
      pendingTestimonials,
      recentEnquiries,
    ] = await Promise.all([
      prisma.package.count({ where: { status: "ACTIVE" } }),
      prisma.destination.count({ where: { status: "ACTIVE" } }),
      prisma.packageEnquiry.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.packageEnquiry.count({ where: { status: "NEW" } }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.testimonial.count({ where: { status: "PENDING" } }),
      prisma.packageEnquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          package: { select: { name: true } },
        },
      }),
    ]);

    // Get monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnquiries = await prisma.packageEnquiry.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      _count: true,
    });

    return NextResponse.json({
      stats: {
        totalPackages,
        totalDestinations,
        totalEnquiries,
        totalBlogPosts,
        newEnquiries,
        pendingReviews,
        pendingTestimonials,
      },
      recentEnquiries,
      monthlyEnquiries,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
