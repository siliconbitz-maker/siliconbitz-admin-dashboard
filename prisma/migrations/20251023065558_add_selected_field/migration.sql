/*
  Warnings:

  - You are about to drop the column `shortlisted` on the `CV` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CV" DROP COLUMN "shortlisted",
ADD COLUMN     "selected" BOOLEAN NOT NULL DEFAULT false;
