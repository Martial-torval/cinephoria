// ENDPOINT API RETURN ALL SHOW BY HIS ID
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const seances = await prisma.seance.findMany({
      include: {
        room: {
          include: {
            cinema: true, // ✅ chaque salle récupère son cinéma
          },
        },
        movie: true,
      },
    });

    if (!seances) {
      return NextResponse.json(
        {
          error:
            "Il n'y a aucune séance dans un de nos cinémas pour le moment ! Venez plus tard ;)",
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(seances);
    }
  } catch (err) {
    console.error(
      "Erreur API cinemas/[id_cinema]/movies/[id_movies/shows] :",
      err
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieId, startTime, endTime, cinemaId, roomId, qualityProjection } =
      body;

    if (
      !movieId ||
      !startTime ||
      !endTime ||
      !cinemaId ||
      !roomId ||
      !qualityProjection
    ) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newShow = await prisma.seance.create({
      data: {
        movieId,
        roomId,
        cinemaId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        qualityProjection,
      },
    });

    return new Response(JSON.stringify(newShow), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur Prisma POST show :", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}
