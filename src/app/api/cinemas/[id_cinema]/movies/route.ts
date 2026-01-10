import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id_cinema: string } }
) {
  const id_cinema = context.params.id_cinema; // Ne pas destructurer dans la signature

  const cinemaId = parseInt(id_cinema);
  if (isNaN(cinemaId)) {
    return NextResponse.json({ error: "cinemaId invalide" }, { status: 400 });
  }

  try {
    const movies = await prisma.cinemaOnMovie.findMany({
      where: {
        cinemaId,
      },
      include: {
        movie: true,
      },
    });

    const detailedMovies = movies.map(({ movie }) => ({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
    }));
    return NextResponse.json({ results: detailedMovies });
  } catch (err) {
    console.error("Erreur API /cinemas/:id_cinema/movies", err);
    return NextResponse.json(
      { error: "Erreur serveur, impossible de récupérer les films" },
      { status: 500 }
    );
  }
}
