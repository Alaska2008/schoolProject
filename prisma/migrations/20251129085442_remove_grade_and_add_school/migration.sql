/*
  Warnings:

  - You are about to drop the column `gradeId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `director` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_gradeId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "gradeId";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "director" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "gradeId";

-- DropTable
DROP TABLE "Grade";
