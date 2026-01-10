"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { fetchShowById, fetchMovieById, fetchCinemaById } from "@/utils/api";
import ReservationSummary from "@/components/ReservationSummary";
import ShowType from "@/types/show";
import { MovieType } from "@/types/movie";
import { CinemaType } from "@/types/cinema";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const showId = searchParams.get("showId");
  const selectedSeats = searchParams.get("seats")?.split("-").map(Number) ?? [];

  const [show, setShow] = useState<ShowType | null>(null);
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [cinema, setCinema] = useState<CinemaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState("");

  const { data: session, isPending } = authClient.useSession();

  /* 🔐 Protection auth */
  useEffect(() => {
    if (!isPending && !session) {
      const callbackUrl = `${pathname}?${searchParams.toString()}`;
      setRedirectMessage(
        "Vous devez vous connecter pour finaliser votre réservation…"
      );

      const timer = setTimeout(() => {
        router.push(
          `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`
        );
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [session, isPending, router, pathname, searchParams]);

  /* 📦 Chargement des données */
  useEffect(() => {
    if (!showId) return;

    const load = async () => {
      try {
        const showData = await fetchShowById(showId);
        if (!showData) return;

        const [movieData, cinemaData] = await Promise.all([
          fetchMovieById(showData.movieId),
          fetchCinemaById(showData.cinemaId),
        ]);

        setShow(showData);
        setMovie(movieData);
        setCinema(cinemaData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showId]);
  const regularTickets = Number(searchParams.get("regular") || 0);
  const kidTickets = Number(searchParams.get("kid") || 0);
  /* ⏳ États */
  if (!showId) {
    return <p className="text-center">Aucune séance sélectionnée.</p>;
  }

  if (redirectMessage) {
    return <p className="text-center mt-10">{redirectMessage}</p>;
  }

  if (loading) {
    return <p className="text-center">Chargement du résumé…</p>;
  }

  if (!show || !movie || !cinema) {
    return <p className="text-center">Résumé indisponible.</p>;
  }

  return (
    <div className="flex justify-center ">
      {/* 🧾 Résumé */}
      <div className="lg:col-span-2 space-y-4 lg:w-2/6 w-full">
        <ReservationSummary
          show={show}
          movie={movie}
          cinema={cinema}
          selectedSeats={selectedSeats} // ✅ Important : le tableau de sièges
          isAuthenticated={!!session} // ✅ Booléen pour l'authentification
          userId={session?.user?.id || ""} // ✅ ID utilisateur pour la réservation
          kidTickets={kidTickets}
          regularTickets={regularTickets}
        />
      </div>
    </div>
  );
}
