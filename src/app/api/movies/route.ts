import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; // Import du Prisma Client

export async function GET() {
  try {
    console.log("📡 Récupération des films depuis la base de données...");

    const movies = await prisma.movie.findMany({
      take: 20, // On limite à 100 films
    });

    return NextResponse.json({ results: movies });
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
