// ENDPOINT API RETURN CINEMA LIST

import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; // Import du Prisma Client

export async function GET() {
  try {
    const cinemas = await prisma.cinema.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        country: true,
        image: true,
        seanceId: true,
      },
    });

    return NextResponse.json({ results: cinemas });
  } catch (error) {
    console.error("❌ Erreur Prisma :", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
