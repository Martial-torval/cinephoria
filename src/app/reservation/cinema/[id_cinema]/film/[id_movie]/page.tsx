import { fetchShowByMovieAndCinema, fetchMovieById } from "@/utils/api";
import ShowCalendar from "@/components/ShowCalendar";
import Image from "next/image";
import { Instrument_Sans } from "next/font/google";
import { Instrument_Serif } from "next/font/google";

const instrument_sans = Instrument_Sans({ weight: "400", subsets: ["latin"] });

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
export default async function Page({
  params,
}: {
  params: { id_cinema: string; id_movie: string };
}) {
  const cinemaId = Number(params.id_cinema);
  const movieId = Number(params.id_movie);

  if (isNaN(cinemaId) || isNaN(movieId)) {
    return <p className="text-center text-muted">Paramètres invalides.</p>;
  }

  const shows = await fetchShowByMovieAndCinema(cinemaId, movieId);
  const movie = await fetchMovieById(movieId);

  // ✅ Adapter selon la structure réelle
  const validShows = (shows ?? []).filter(
    (s) => s?.id && s?.startTime && s?.room
  );

  if (validShows.length === 0) {
    return <p className="text-center text-muted">Aucune séance disponible.</p>;
  }

  const now = new Date();
  const upcomingShows = validShows.filter(
    (s) => new Date(s.startTime).getTime() > now.getTime()
  );

  if (upcomingShows.length === 0) {
    return <p className="text-center text-muted">Aucune séance à venir.</p>;
  }

  const sortedShows = upcomingShows.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="flex lg:flex-row md:flex-col flex-col gap-6 p-4">
      {/* Affiche du film */}
      <div className="w-full lg:flex md:flex block justify-stretch lg:border-r md:border-none border-none border-secondary  ">
        <Image
          src={movie.posterUrl || "/placeholder.jpg"}
          alt={`Affiche du film ${movie.title}`}
          width={500}
          height={650}
          className=" shadow-lg  lg:mb-0 md:mb-5 mb-5 lg:w-auto md:w-2/4 w-auto"
        />
        <div className="lg:flex  md:block flex flex-col lg:w-auto md:w-full w-auto ml-5">
          <h3 className={`text-5xl mb-5 ${instrument_serif.className}`}>
            {movie.title}
          </h3>
          <p className={instrument_sans.className}>{movie.description}</p>
        </div>
      </div>

      {/* Calendrier des séances */}
      <div className="w-full lg:block md:flex block mt-5">
        <ShowCalendar
          shows={sortedShows}
          posterUrl={movie.posterUrl}
          cinemaId={cinemaId}
          movieId={movieId}
        />
      </div>
    </div>
  );
}
