/*
  Warnings:

  - The `status` column on the `PackageEnquiry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'PENDING', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_packageId_fkey";

-- AlterTable
ALTER TABLE "PackageEnquiry" DROP COLUMN "status",
ADD COLUMN     "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW';

-- DropTable
DROP TABLE "Booking";

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateIndex
CREATE INDEX "PackageEnquiry_status_idx" ON "PackageEnquiry"("status");
