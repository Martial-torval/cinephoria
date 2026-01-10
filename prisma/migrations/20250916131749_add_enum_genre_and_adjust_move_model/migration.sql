/*
  Warnings:

  - You are about to drop the column `backdropPath` on the `Movie` table. All the data in the column will be lost.
  - The `genre` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dateReview` on the `Review` table. All the data in the column will be lost.
  - Made the column `description` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."Genre" AS ENUM ('Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentaire', 'Drame', 'Famille', 'Fantasie', 'Historique', 'Horreur', 'Musique', 'Mystère', 'Romance', 'ScienceFiction', 'Thriller', 'Guerre', 'Western');

-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "backdropPath",
ADD COLUMN     "rate" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "genre",
ADD COLUMN     "genre" "public"."Genre"[];

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "dateReview",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
