// ENDPOINT API RETURN ALL SHOW FOR A MOVIE IN A CINEMA
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generatePMRSeats, getSeatsPerRow } from "@/utils/format";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_cinema: string; id_movie: string } }
) {
  try {
    const id_cinema = parseInt(params.id_cinema);
    const id_movie = parseInt(params.id_movie);

    if (isNaN(id_cinema)) {
      return NextResponse.json(
        { error: "ID Cinéma invalide" },
        { status: 400 }
      );
    }

    if (isNaN(id_movie)) {
      return NextResponse.json({ error: "ID Movie invalide" }, { status: 400 });
    }

    const seances = await prisma.seance.findMany({
      where: {
        cinemaId: id_cinema,
        movieId: id_movie,
      },
      include: {
        movie: true,
        cinema: true,
        room: true,
        bookings: true,
      },
    });

    if (!seances || seances.length === 0) {
      return NextResponse.json(
        { error: "Aucun film est programmé dans ce cinéma actuellement" },
        { status: 404 }
      );
    }

    // 🔹 Calcul des places disponibles pour chaque séance
    const enrichedSeances = seances.map((seance) => {
      const totalCapacity = seance.room.capacite;

      // Comptage des réservations déjà faites
      const reservedSeats =
        seance.bookings?.reduce((acc, r) => acc + r.numberOfSeats, 0) || 0;

      // Comptage des places PMR
      let pmrSeatsCount = 0;
      try {
        const seatsPerRow = getSeatsPerRow(totalCapacity);
        const pmrSeats = generatePMRSeats(totalCapacity, seatsPerRow);
        pmrSeatsCount = pmrSeats.length;
      } catch (err) {
        console.warn(
          `Impossible de générer les places PMR pour la salle ${seance.room.id}`,
          err
        );
        pmrSeatsCount = 0; // fallback si problème
      }

      const availableSeat = Math.max(
        0,
        totalCapacity - reservedSeats - pmrSeatsCount
      );
      const reservedSeatsList = seance.bookings.flatMap((b) => b.bookingSeats);

      return {
        ...seance,
        room: {
          ...seance.room,
          availableSeat, // 👈 ajouté dans room
        },
        reservedSeats: reservedSeatsList,
      };
    });

    return NextResponse.json(enrichedSeances);
  } catch (err) {
    console.error(
      "Erreur API cinemas/[id_cinema]/movies/[id_movies]/shows :",
      err
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
