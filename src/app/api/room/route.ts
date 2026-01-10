import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      take: 20, // On limite à 100 salles
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qualityProjection, capacity, cinemaId } = body;

    if (!qualityProjection || !capacity || !cinemaId) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // On calcule le prochain numéro de salle pour ce cinéma
    const maxNumero = await prisma.room.aggregate({
      where: { cinemaId },
      _max: { numero: true },
    });
    const nextNumero = (maxNumero._max.numero ?? 0) + 1;

    const newRoom = await prisma.room.create({
      data: {
        qualityProjection,
        capacite: capacity,
        numero: nextNumero,
        cinemaId,
      },
    });

    return new Response(JSON.stringify(newRoom), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création de la salle :", error);
    return new Response("Erreur interne du serveur", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
