/*
  Warnings:

  - Changed the type of `minimumAge` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."MinimumAge" AS ENUM ('en_attente', 'r', 'solu');

-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "minimumAge",
ADD COLUMN     "minimumAge" "public"."MinimumAge" NOT NULL;
