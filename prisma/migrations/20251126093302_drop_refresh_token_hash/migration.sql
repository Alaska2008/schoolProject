/*
  Warnings:

  - You are about to drop the column `refreshTokenHash` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refreshTokenHash",
ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken";
