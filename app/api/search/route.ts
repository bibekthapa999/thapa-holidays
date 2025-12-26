import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET public search for packages and destinations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchQuery = query.toLowerCase();

    // Search packages and destinations in parallel
    const [packages, destinations] = await Promise.all([
      // Search active packages
      prisma.package.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { destinationName: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
            { country: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          destinationName: true,
          location: true,
          price: true,
          duration: true,
          image: true,
          rating: true,
        },
        take: 6,
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
      }),
      // Search active destinations
      prisma.destination.findMany({
        where: {
          status: "ACTIVE",
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
          country: true,
          image: true,
          rating: true,
        },
        take: 4,
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
      }),
    ]);

    // Format results
    const results = [
      ...packages.map((p) => ({
        id: p.id,
        type: "package" as const,
        title: p.name,
        subtitle: `${p.destinationName} • ${p.duration}`,
        price: p.price,
        href: `/packages/${p.slug}`,
        image: p.image,
        rating: p.rating,
      })),
      ...destinations.map((d) => ({
        id: d.id,
        type: "destination" as const,
        title: d.name,
        subtitle: `${d.location}, ${d.country}`,
        href: `/destinations?search=${d.slug}`,
        image: d.image,
        rating: d.rating,
      })),
    ];

    return NextResponse.json({
      results,
      counts: {
        packages: packages.length,
        destinations: destinations.length,
      },
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
