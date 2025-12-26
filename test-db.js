const { PrismaClient } = require("@prisma/client");

async function test() {
  const prisma = new PrismaClient();
  try {
    // Test destinations
    const destinations = await prisma.destination.findMany({ take: 5 });
    console.log("Destinations found:", destinations.length);

    // Test packages with destination include
    const packages = await prisma.package.findMany({
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
      take: 5,
    });
    console.log("Packages found:", packages.length);

    if (packages.length > 0) {
      console.log("Sample package:", {
        id: packages[0].id,
        name: packages[0].name,
        destinationId: packages[0].destinationId,
        destination: packages[0].destination,
      });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
