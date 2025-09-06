/*
  Warnings:

  - You are about to drop the column `endDate` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- AlterTable
ALTER TABLE "public"."Class" ALTER COLUMN "supervisorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Lesson" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "birthday" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Teacher" ADD COLUMN     "birthday" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
