import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET search across all admin resources
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchQuery = query.toLowerCase();

    // Search across multiple resources in parallel
    const [
      packages,
      destinations,
      enquiries,
      contacts,
      blogPosts,
      testimonials,
    ] = await Promise.all([
      // Search packages
      prisma.package.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { destinationName: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          destinationName: true,
          status: true,
        },
        take: 5,
      }),
      // Search destinations
      prisma.destination.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
            { country: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          status: true,
        },
        take: 5,
      }),
      // Search enquiries
      prisma.packageEnquiry.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
            { phone: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          package: { select: { name: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      // Search contacts
      prisma.contactInquiry.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
            { subject: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      // Search blog posts
      prisma.blogPost.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { author: { contains: searchQuery, mode: "insensitive" } },
            { category: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          published: true,
        },
        take: 5,
      }),
      // Search testimonials
      prisma.testimonial.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          location: true,
          rating: true,
          status: true,
        },
        take: 5,
      }),
    ]);

    // Format results with category information
    const results = [
      ...packages.map((p) => ({
        id: p.id,
        type: "package" as const,
        title: p.name,
        subtitle: p.destinationName,
        href: `/admin/packages/${p.id}`,
        status: p.status,
      })),
      ...destinations.map((d) => ({
        id: d.id,
        type: "destination" as const,
        title: d.name,
        subtitle: d.location,
        href: `/admin/destinations/${d.id}`,
        status: d.status,
      })),
      ...enquiries.map((e) => ({
        id: e.id,
        type: "enquiry" as const,
        title: e.name,
        subtitle: e.package?.name || e.email,
        href: `/admin/enquiries`,
        status: e.status,
      })),
      ...contacts.map((c) => ({
        id: c.id,
        type: "contact" as const,
        title: c.name,
        subtitle: c.subject || c.email,
        href: `/admin/contacts`,
        status: c.status,
      })),
      ...blogPosts.map((b) => ({
        id: b.id,
        type: "blog" as const,
        title: b.title,
        subtitle: `By ${b.author}`,
        href: `/admin/blog`,
        status: b.published ? "PUBLISHED" : "DRAFT",
      })),
      ...testimonials.map((t) => ({
        id: t.id,
        type: "testimonial" as const,
        title: t.name,
        subtitle: `${t.location} - ${t.rating}★`,
        href: `/admin/testimonials`,
        status: t.status,
      })),
    ];

    return NextResponse.json({
      results,
      counts: {
        packages: packages.length,
        destinations: destinations.length,
        enquiries: enquiries.length,
        contacts: contacts.length,
        blogPosts: blogPosts.length,
        testimonials: testimonials.length,
      },
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
