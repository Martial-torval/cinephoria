"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { fetchMovieById, fetchShowByMovieAndCinema } from "@/utils/api";
import { MovieType } from "@/types/movie";
import CardMovie from "@/components/CardMovie";
import CardShow from "@/components/CardShow";
import HorizontalDateSelector from "@/components/HorizontalDateSelector";
import {
  formatDateToFrenchHour,
  formatShowQuality,
  getPriceByQuality,
} from "@/utils/format";
import dayjs from "dayjs";
import Image from "next/image";
import ShowType from "@/types/show";
import CardReview from "@/components/CardReview";
import { Instrument_Serif } from "next/font/google";
export const fetchCache = "force-no-store";

dayjs.locale("fr");
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
export default function Page() {
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [seances, setSeances] = useState<ShowType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");
  const cinemaId = searchParams.get("cinemaId"); // optionnel
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadMovieAndShows = async () => {
      if (!movieId) return;

      // 🔹 Récupère les infos du film
      const data = await fetchMovieById(parseInt(movieId, 10));
      if (!data) {
        setMovie(null);
        setSeances([]);
        return;
      }
      setMovie(data);

      // 🔹 Récupère les séances
      let shows: ShowType[] = [];
      if (cinemaId) {
        shows = await fetchShowByMovieAndCinema(
          parseInt(cinemaId, 10),
          parseInt(movieId, 10)
        );
      } else {
        shows = data.seances ?? [];
      }

      // 🔹 Filtrer les séances passées
      const now = new Date();
      shows = shows.filter(
        (s) => new Date(s.startTime).getTime() > now.getTime()
      );

      setSeances(shows);

      // 🔹 Définit la première date disponible
      const dates = Array.from(
        new Set(shows.map((s) => dayjs(s.startTime).format("YYYY-MM-DD")))
      ).sort();
      setSelectedDate(dates[0] ?? "");
    };

    loadMovieAndShows();
  }, [movieId, cinemaId]);

  // ✅ Dates et séances filtrées
  const allDates = useMemo(() => {
    return Array.from(
      new Set(seances.map((s) => dayjs(s.startTime).format("YYYY-MM-DD")))
    ).sort();
  }, [seances]);

  const filteredShows = useMemo(() => {
    return seances.filter(
      (s) => dayjs(s.startTime).format("YYYY-MM-DD") === selectedDate
    );
  }, [seances, selectedDate]);

  // ✅ Grouper par cinéma
  const showsByCinema = useMemo(() => {
    const map: Record<number, any[]> = {};
    filteredShows.forEach((s) => {
      const cid = s.room.cinema?.id ?? 0;
      if (!map[cid]) map[cid] = [];
      map[cid].push(s);
    });
    return map;
  }, [filteredShows]);

  if (!mounted) return null;
  if (!movie) return <p>Chargement du film...</p>;
  return (
    <article className="lg:p-6 md:p-6 p-0 text-secondary">
      <CardMovie
        id={movie.id}
        title={movie.title}
        description={movie.description}
        posterUrl={movie.posterUrl}
        minimumAge={movie.minimumAge}
        isAdult={movie.isAdult}
        genre_list={movie.genre}
        rating={movie.rating}
        isFavorite={movie.isFavorite}
        className="mb-6 w-full h-96 flex flex-col justify-end"
      />

      <h2
        className={`${instrument_serif.className} lg:text-6xl md:text-5xl text-4xl mt-20 mb-5`}
      >
        Liste des prochaines séances
      </h2>

      {allDates.length > 0 && (
        <HorizontalDateSelector
          dates={allDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      )}

      <section className="mt-6 space-y-8">
        {Object.keys(showsByCinema).length > 0 ? (
          Object.entries(showsByCinema).map(([cinemaId, shows]) => {
            const cinemaName = shows[0].room.cinema?.name ?? "Cinéma inconnu";
            const cinemaImage =
              shows[0].room.cinema?.image ?? "/placeholder_cinema.jpg";

            return (
              <div
                key={cinemaId}
                className=" flex items-baseline gap-5 lg:flex-row md:flex-row flex-col mb-20"
              >
                <div className="flex flex-col  text-center">
                  <h3
                    className={`font-semibold text-4xl mb-2 ${instrument_serif.className}`}
                  >
                    {cinemaName}
                  </h3>
                  <Image
                    src={cinemaImage}
                    width={300}
                    height={300}
                    alt={cinemaName}
                    className="object-cover  mb-2"
                  />
                </div>

                <div className="flex h-full gap-4 cardShow mt-3">
                  {shows.map((seance) => {
                    const formattedQuality = formatShowQuality(
                      seance.qualityProjection
                    );
                    const price = getPriceByQuality(seance.qualityProjection);

                    // Calculer les places disponibles (capacité - réservées - PMR)
                    const availableSeats =
                      seance.room.capacite -
                      (seance.reservedSeats?.length ?? 0) -
                      (seance.room.pmrSeats ?? 0);

                    return (
                      <CardShow
                        key={seance.id}
                        id={seance.id}
                        startTime={formatDateToFrenchHour(seance.startTime)}
                        endTime={formatDateToFrenchHour(seance.endTime)}
                        quality={formattedQuality}
                        capacity={seance.room.capacite}
                        room={{
                          number: seance.room.numero,
                          availableSeat: availableSeats,
                        }}
                        price={price.toString()}
                        link={`/reservation/cinema/${cinemaId}/film/${movie.id}/seance/${seance.id}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p className="mt-4 text-muted">
            Aucune séance disponible pour ce jour.
          </p>
        )}

        <CardReview movieId={movie.id} />
      </section>
    </article>
  );
}
