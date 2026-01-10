import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapte si besoin

interface Params {
  params: {
    id_cinema: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const cinemaId = Number(params.id_cinema);

  // ❌ ID invalide
  if (isNaN(cinemaId)) {
    return NextResponse.json(
      { error: "Identifiant du cinéma invalide" },
      { status: 400 }
    );
  }

  try {
    const cinema = await prisma.cinema.findUnique({
      where: { id: cinemaId },
      include: {
        rooms: true, // optionnel
      },
    });

    // ❌ Cinéma introuvable
    if (!cinema) {
      return NextResponse.json(
        { error: "Cinéma introuvable" },
        { status: 404 }
      );
    }

    // ✅ OK
    return NextResponse.json(cinema, { status: 200 });
  } catch (error) {
    console.error("GET /api/cinemas/[id_cinema] error:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du cinéma" },
      { status: 500 }
    );
  }
}
