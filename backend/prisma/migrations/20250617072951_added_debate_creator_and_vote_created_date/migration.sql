/*
  Warnings:

  - Added the required column `creatorId` to the `debates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "debates" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "debates" ADD CONSTRAINT "debates_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
