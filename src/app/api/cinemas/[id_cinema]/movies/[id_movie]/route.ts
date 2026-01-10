import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_cinema: string; id_movie: string } }
) {
  try {
    const id_cinema = parseInt(params.id_cinema);
    const id_movie = parseInt(params.id_movie);

    if (isNaN(id_cinema)) {
      return NextResponse.json(
        { error: "ID Cinéma invalide" },
        { status: 400 }
      );
    }

    if (isNaN(id_movie)) {
      return NextResponse.json({ error: "ID Movie invalide" }, { status: 400 });
    }

    const seances = await prisma.seance.findMany({
      where: {
        cinemaId: id_cinema,
        movieId: id_movie,
      },
      include: {
        movie: true,
        cinema: true,
      },
    });

    if (seances.length === 0) {
      return NextResponse.json(
        { error: "Aucun film n'est programmé dans ce cinéma actuellement" },
        { status: 404 }
      );
    }

    return NextResponse.json(seances);

    // const  = seances.movies.map((relation) => relation.movie);

    // return NextResponse.json(movies);
  } catch (err) {
    console.error("Erreur API cinéma/films :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
