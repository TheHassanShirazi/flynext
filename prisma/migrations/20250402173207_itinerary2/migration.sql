/*
  Warnings:

  - You are about to drop the column `itineraryId` on the `Flight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_itineraryId_fkey";

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "itineraryId";
