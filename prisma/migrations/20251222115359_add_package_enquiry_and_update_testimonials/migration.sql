/*
  Warnings:

  - The `status` column on the `Testimonial` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "accommodations" JSONB,
ADD COLUMN     "faqs" JSONB,
ADD COLUMN     "policies" JSONB;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "email" TEXT,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "tripDate" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "PackageEnquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "packageId" TEXT,
    "packageName" TEXT,
    "travelDate" TIMESTAMP(3),
    "travelTime" TEXT,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "rooms" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PackageEnquiry_status_idx" ON "PackageEnquiry"("status");

-- CreateIndex
CREATE INDEX "PackageEnquiry_packageId_idx" ON "PackageEnquiry"("packageId");

-- CreateIndex
CREATE INDEX "PackageEnquiry_createdAt_idx" ON "PackageEnquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "PackageEnquiry" ADD CONSTRAINT "PackageEnquiry_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
