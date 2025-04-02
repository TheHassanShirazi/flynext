/*
  Warnings:

  - Added the required column `itineraryId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itineraryId` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "itineraryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "itineraryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
