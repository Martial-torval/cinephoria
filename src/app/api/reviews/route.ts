import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rooms = await prisma.review.findMany({
      include: {
        user: true,
        movie: true,
      },
    });
    return new Response(JSON.stringify({ results: rooms }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body.rating);

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }
    const newReview = await prisma.review.create({
      data: {
        movieId: body.movieId,
        rating: body.rating,
        comment: body.comment,
        statut: "en_attente",
        userId, // à remplacer par l’ID de l’utilisateur connecté
      },
    });

    return NextResponse.json(newReview);
  } catch (err) {
    console.error("❌ Erreur POST /api/reviews :", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
