/*
  Warnings:

  - You are about to drop the column `itineraryId` on the `Flight` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_itineraryId_fkey";

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "itineraryId";

-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
