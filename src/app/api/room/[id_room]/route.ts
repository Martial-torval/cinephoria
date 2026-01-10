import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id_room: string } }
) {
  try {
    const id = Number(params.id_room);
    const body = await req.json();
    const { name, capacite, qualityProjection, cinemaId } = body;

    if (!name && !capacite && !qualityProjection && !cinemaId) {
      return new Response(
        JSON.stringify({
          error: "Au moins un champ requis pour la modification",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(capacite && { capacite }),
        ...(qualityProjection && { qualityProjection }),
        ...(cinemaId && { cinemaId }),
      },
    });

    return new Response(JSON.stringify(updatedRoom), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur Prisma PUT room :", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_room: string } }
) {
  try {
    const id = Number(params.id_room);

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID de la salle manquant" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.room.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Salle supprimée avec succès" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Erreur Prisma DELETE room :", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}
