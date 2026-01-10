import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id_movie: string } }
) {
  try {
    const movieId = Number(params.id_movie);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "ID du film invalide" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { movieId, statut: "valid" }, // 👈 seulement les avis validés
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("❌ Erreur GET /api/reviews/[movieId]:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
