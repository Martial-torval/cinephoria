import { prisma } from "@/lib/prisma";
import { generatePMRSeats, getSeatsPerRow } from "@/utils/format";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_show: string } }
) {
  try {
    const id_show = parseInt(params.id_show);

    if (isNaN(id_show)) {
      return NextResponse.json(
        { error: "ID Séance invalide" },
        { status: 400 }
      );
    }

    const seance = await prisma.seance.findUnique({
      where: { id: id_show },
      include: {
        movie: true,
        cinema: true,
        room: true,
        bookings: true, // inclut toutes les réservations pour cette séance
      },
    });

    if (!seance) {
      return NextResponse.json(
        { error: "Séance introuvable" },
        { status: 404 }
      );
    }

    // Calcul des places PMR
    let pmrSeatsCount = 0;
    const seatsPerRow = getSeatsPerRow(seance.room.capacite);

    try {
      const pmrSeats = generatePMRSeats(seance.room.capacite, seatsPerRow);
      pmrSeatsCount = pmrSeats.length;
    } catch (err) {
      console.warn("Impossible de générer les places PMR :", err);
      pmrSeatsCount = 0; // fallback si la capacité n'est pas multiple du nombre de sièges par rangée
    }
    const totalReserved = seance.bookings.reduce(
      (acc, b) => acc + b.numberOfSeats,
      0
    );
    // Calcul des places disponibles en soustrayant PMR et réservations
    const availableSeats = Math.max(
      0,
      seance.room.capacite - totalReserved - pmrSeatsCount
    );

    const reservedSeats = seance.bookings.flatMap((b) => b.bookingSeats);

    // Retourner la séance avec availableSeats
    return NextResponse.json({
      ...seance,
      room: { ...seance.room, availableSeats },
      reservedSeats,
    });
  } catch (err) {
    console.error("Erreur API /api/shows/[id_show] :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id_show: string } }
) {
  try {
    const id = Number(params.id_show);
    const body = await req.json();
    const { movieId, qualityProjection, roomId, cinemaId, startTime, endTime } =
      body;

    if (
      !movieId &&
      !roomId &&
      !cinemaId &&
      startTime! &&
      !endTime &&
      !qualityProjection
    ) {
      return new Response(
        JSON.stringify({
          error: "Au moins un champ requis pour la modification",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedShow = await prisma.seance.update({
      where: { id },
      data: {
        movieId: body.movieId,
        roomId: body.roomId,
        startTime: body.startTime,
        endTime: body.endTime,
      },
    });

    return new Response(JSON.stringify(updatedShow), {
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
  { params }: { params: { id_show: string } }
) {
  try {
    const id = Number(params.id_show);

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID invalide" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.seance.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "Séance supprimée avec succès" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Erreur Prisma DELETE show :", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}
