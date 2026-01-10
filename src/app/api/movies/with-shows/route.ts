// /api/movies/with-shows/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cinemaId = searchParams.get("cinemaId");

    const movies = await prisma.movie.findMany({
      where: {
        seances: {
          some: cinemaId ? { cinemaId: Number(cinemaId) } : {},
        },
      },
      include: {
        seances: {
          include: { cinema: true, room: true },
        },
      },
    });

    return NextResponse.json({ results: movies });
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
