import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; // Import du Prisma Client

export async function GET() {
  try {
    console.log("📡 Récupération des cinema depuis la base de données...");

    const cinema = await prisma.cinema.findMany();

    return NextResponse.json({ results: cinema });
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
