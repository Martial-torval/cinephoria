"use client";

import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import ShowType from "@/types/show";
import { MovieType } from "@/types/movie";
import { CinemaType } from "@/types/cinema";
import {
  formatMinimumAge,
  formatShowQuality,
  getPriceByQuality,
} from "@/utils/format";
import "dayjs/locale/fr";
import { createBooking } from "@/utils/api";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";

dayjs.locale("fr");

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

interface ReservationSummaryProps {
  show: ShowType;
  movie: MovieType;
  cinema: CinemaType;
  selectedSeats: number[];
  isAuthenticated: boolean;
  userId: string;
  regularTickets: number;
  kidTickets: number;
}

export default function ReservationSummary({
  show,
  movie,
  cinema,
  selectedSeats,
  isAuthenticated,
  userId,
  regularTickets,
  kidTickets,
}: ReservationSummaryProps) {
  const router = useRouter();

  if (!show || !movie || !cinema) return null;

  const pricePerRegular = getPriceByQuality(show.qualityProjection);
  const pricePerKid = pricePerRegular - 6; // ajustable selon ta règle
  const totalTickets = regularTickets + kidTickets;
  const totalPrice =
    regularTickets * pricePerRegular + kidTickets * pricePerKid;

  const handleValidateReservation = async () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour valider la réservation !", {
        style: { padding: "16px", maxWidth: "100%", borderRadius: "0px" },
      });
      return;
    }
    if (!userId) {
      toast.error("Impossible de récupérer l'utilisateur !", {
        style: { padding: "16px", maxWidth: "100%", borderRadius: "0px" },
      });
      return;
    }
    if (totalTickets === 0) {
      toast.error("Aucun siège sélectionné !", {
        style: { padding: "16px", maxWidth: "100%", borderRadius: "0px" },
      });
      return;
    }

    const bookingData = {
      userId,
      seanceId: show.id,
      numberOfSeats: totalTickets,
      bookingSeats: selectedSeats,
      totalPrice,
    };

    const result = await createBooking(bookingData);

    if (result) {
      router.push("/mon-espace");
    } else {
      toast.error("Une erreur est survenue lors de la réservation !", {
        style: { padding: "16px", maxWidth: "100%", borderRadius: "0px" },
      });
    }
  };

  return (
    <aside className="bg-secondary text-primary p-4 space-y-4">
      <h2
        className={`text-center lg:text-6xl md:text-5xl text-4xl mb-14 ${instrument_serif.className}`}
      >
        Résumé de votre réservation
      </h2>

      {/* 🎬 Film */}
      <div className="flex gap-4">
        <Image
          src={movie.posterUrl || "/placeholder.jpg"}
          alt={`Affiche du film ${movie.title}`}
          width={120}
          height={180}
          className="object-cover"
        />
        <div>
          <h3 className="font-semibold">{movie.title}</h3>
          <p className="text-sm text-muted">{movie.genre?.join(", ")}</p>
          {movie.minimumAge && (
            <p className="text-sm">
              {formatMinimumAge(String(movie.minimumAge))}
            </p>
          )}
        </div>
      </div>

      <hr />

      {/* 🎥 Cinéma */}
      <div>
        <p className="font-semibold">{cinema.name}</p>
        <p className="text-sm text-muted">
          {cinema.address} – {cinema.city}
        </p>
      </div>

      <hr />

      {/* ⏰ Séance */}
      <div>
        <p className="font-semibold">Séance</p>
        <p>
          {dayjs(show.startTime).format("dddd DD MMMM")}
          <br />
          {dayjs(show.startTime).format("HH:mm")} –{" "}
          {dayjs(show.endTime).format("HH:mm")}
        </p>
        <p className="text-sm">
          Salle {show.room.numero} · {formatShowQuality(show.qualityProjection)}
        </p>
      </div>

      <hr />

      {/* 🎟️ Sièges */}
      <div>
        <p className="font-semibold">Places sélectionnées</p>
        <p className="text-sm">
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "Aucune place sélectionnée"}
        </p>
      </div>

      <hr />

      {/* 💰 Prix */}
      <div className="space-y-1">
        {regularTickets > 0 && (
          <p>
            🎟️ <strong>{regularTickets}</strong> ticket
            {regularTickets > 1 && "s"} (Normal) ={" "}
            {regularTickets * pricePerRegular}€
          </p>
        )}
        {kidTickets > 0 && (
          <p>
            🎟️ <strong>{kidTickets}</strong> ticket{kidTickets > 1 && "s"}{" "}
            (Jeune) = {kidTickets * pricePerKid}€
          </p>
        )}
        <p className="text-xl font-semibold pt-2">Total : {totalPrice} €</p>
      </div>

      {/* ✅ Validation */}
      <button
        onClick={handleValidateReservation}
        className="w-full mt-4 bg-primary text-secondary py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        disabled={totalTickets === 0}
      >
        Valider la réservation
      </button>
    </aside>
  );
}
