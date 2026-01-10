import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";
import { MinimumAge } from "@prisma/client"; // 🟢 Import de l'enum Prisma

export async function GET(
  _req: Request,
  { params }: { params: { id_movie: string } }
) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(params.id_movie) },
      include: {
        seances: {
          include: {
            room: {
              include: {
                cinema: true, // ✅ pour avoir le nom du cinéma
              },
            },
          },
        },
        reviews: {
          where: { statut: ReviewStatus.valid },
          select: { rating: true },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Film non trouvé" }, { status: 404 });
    }
    const rating =
      movie.reviews && movie.reviews.length > 0
        ? movie.reviews.reduce((acc, r) => acc + r.rating, 0) /
          movie.reviews.length
        : 0;

    return NextResponse.json({ ...movie, rating });
  } catch (error) {
    console.error("Erreur GET /api/movies/[id] :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id_movie: string } }
) {
  try {
    const body = await req.json();

    // 🧭 Map entre nombre et enum Prisma réel
    const ageEnumMap: Record<number, MinimumAge> = {
      0: MinimumAge.AGE_0,
      10: MinimumAge.AGE_10,
      12: MinimumAge.AGE_12,
      16: MinimumAge.AGE_16,
      18: MinimumAge.AGE_18,
    };

    const updatedMovie = await prisma.movie.update({
      where: { id: Number(params.id_movie) },
      data: {
        title: body.title,
        description: body.description,
        posterUrl: body.posterUrl,
        genre: { set: body.genre },
        minimumAge: ageEnumMap[body.minimumAge] ?? MinimumAge.AGE_0, // ✅ enum réel
      },
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur update :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du film" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id_movie: string } }
) {
  try {
    await prisma.movie.delete({
      where: { id: Number(params.id_movie) },
    });

    return NextResponse.json({ message: "✅ Film supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur suppression film :", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
