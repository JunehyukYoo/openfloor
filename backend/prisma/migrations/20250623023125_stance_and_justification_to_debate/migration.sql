/*
  Warnings:

  - You are about to drop the column `topicId` on the `stances` table. All the data in the column will be lost.
  - Added the required column `debateId` to the `stances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stances" DROP CONSTRAINT "stances_topicId_fkey";

-- AlterTable
ALTER TABLE "stances" DROP COLUMN "topicId",
ADD COLUMN     "debateId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "stances" ADD CONSTRAINT "stances_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "debates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
