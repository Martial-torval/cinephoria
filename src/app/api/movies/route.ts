import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const movies = await prisma.movie.findMany({
    include: {
      reviews: {
        where: { statut: "valid" }, // ou ReviewStatus.valid selon la version
        select: { rating: true },
      },
      // autres includes si besoin
    },
    orderBy: { createdAt: "desc" },
  });

  // Calcul de la note moyenne
  const moviesWithRating = movies.map((movie) => {
    const avgRating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, r) => acc + r.rating, 0) /
          movie.reviews.length
        : 0;
    return { ...movie, rating: avgRating };
  });

  return NextResponse.json(moviesWithRating);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, description, minimumAge, posterUrl, genre } = body;

    // 🧩 Vérifications basiques
    if (!title || !description || !posterUrl || !minimumAge || !genre) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    const enumMinimumAge = `AGE_${minimumAge}`;
    // ⚙️ Création du film
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        minimumAge: enumMinimumAge as any, // doit être une valeur comme "AGE_12"
        posterUrl,
        genre, // tableau d’enums : ["Action", "Comedy"]
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    console.error("Erreur POST /api/movies:", error);
    return NextResponse.json(
      { error: "Erreur création film côté serveur" },
      { status: 500 }
    );
  }
}
