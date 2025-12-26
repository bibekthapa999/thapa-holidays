-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Destination_status_featured_idx" ON "Destination"("status", "featured");
