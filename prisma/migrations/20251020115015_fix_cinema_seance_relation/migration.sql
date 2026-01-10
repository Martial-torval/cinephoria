/*
  Warnings:

  - A unique constraint covering the columns `[numero,cinemaId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_numero_cinemaId_key" ON "public"."Room"("numero", "cinemaId");
