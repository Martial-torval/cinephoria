// ENDPOINT API RETURN A NEW RESERVATION (USER + SHOW + PLACES)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ton client Prisma
import { authClient } from "@/lib/auth-client";
export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { cookie: cookieHeader || "" },
    },
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reservations = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        seance: { include: { movie: true, room: true, cinema: true } },
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching reservations" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { cookie: cookieHeader || "" },
    },
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { userId, seanceId, numberOfSeats, totalPrice, bookingSeats } = body;

  if (!seanceId || !numberOfSeats) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    // 🔹 1. Récupérer la séance + salle + réservations existantes
    const seance = await prisma.seance.findUnique({
      where: { id: seanceId },
      include: {
        room: true,
        bookings: true, // bookings existants
      },
    });
    if (!seance) {
      return NextResponse.json(
        { error: "Séance introuvable" },
        { status: 404 }
      );
    }
    // 🔹 2. Calculer les places déjà réservées
    const reservedSeats = seance.bookings.reduce(
      (acc, booking) => acc + booking.numberOfSeats,
      0
    );
    const availableSeats = seance.room.capacite - reservedSeats;
    // 🔹 3. Vérifier si assez de places dispo
    if (numberOfSeats > availableSeats) {
      return NextResponse.json(
        { error: `Il ne reste que ${availableSeats} places disponibles.` },
        { status: 400 }
      );
    }
    const reservation = await prisma.booking.create({
      data: {
        statut: "CONFIRMED",
        userId: session.user.id,
        seanceId,
        numberOfSeats,
        bookingSeats,
        totalPrice,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating reservation" },
      { status: 500 }
    );
  }
}
