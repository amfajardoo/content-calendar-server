/*
  Warnings:

  - You are about to drop the column `platform` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `title` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Media" DROP CONSTRAINT "Media_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "platform",
DROP COLUMN "teamId",
DROP COLUMN "text",
ADD COLUMN     "content" TEXT,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Media";

-- DropTable
DROP TABLE "public"."Team";

-- DropTable
DROP TABLE "public"."TeamMember";

-- DropEnum
DROP TYPE "public"."Platform";

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
