/*
  Warnings:

  - You are about to drop the column `priv` on the `debates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "debates" DROP COLUMN "priv",
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT true;
