/*
  Warnings:

  - The `role` column on the `participants` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CREATOR', 'ADMIN', 'DEBATER', 'OBSERVER');

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'OBSERVER';
