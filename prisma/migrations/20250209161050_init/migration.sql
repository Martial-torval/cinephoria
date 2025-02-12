-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "backdrop_path" TEXT,
    "release_date" TEXT NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL,
    "genre_ids" JSONB NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);
