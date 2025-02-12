/*
  Warnings:

  - You are about to drop the column `backdrop_path` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `genre_ids` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `poster_path` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `vote_average` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `minimumAge` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posterUrl` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('utilisateur', 'employe', 'administrateur');

-- CreateEnum
CREATE TYPE "QualityProjection" AS ENUM ('FOUR_DX', 'THREE_D', 'FOUR_K');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('confirmé', 'annulé', 'utilisé');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('en_attente', 'validé', 'refusé');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('en_attente', 'résolu');

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "backdrop_path",
DROP COLUMN "genre_ids",
DROP COLUMN "overview",
DROP COLUMN "poster_path",
DROP COLUMN "release_date",
DROP COLUMN "vote_average",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minimumAge" INTEGER NOT NULL,
ADD COLUMN     "posterUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cinema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "capacite" INTEGER NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "qualityProjection" "QualityProjection" NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seance" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "qualityProjection" "QualityProjection" NOT NULL,

    CONSTRAINT "Seance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seanceId" INTEGER NOT NULL,
    "numberOfSeats" INTEGER NOT NULL,
    "bookingSeats" INTEGER NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "statut" "BookingStatus" NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "dateReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "ReviewStatus" NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "statut" "IncidentStatus" NOT NULL,
    "dateSignalement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dateMessage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seance" ADD CONSTRAINT "Seance_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seance" ADD CONSTRAINT "Seance_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "Seance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
