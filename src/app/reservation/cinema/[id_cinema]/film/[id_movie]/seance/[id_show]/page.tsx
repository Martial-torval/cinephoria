import FormSeat from "@/components/FormSeat";
import { fetchShowById, fetchMovieById, fetchCinemaById } from "@/utils/api";

interface PageProps {
  params: { id_show: string };
}

export default async function Page({ params }: PageProps) {
  const show = await fetchShowById(params.id_show);

  if (!show) {
    return <p>Séance introuvable.</p>;
  }

  // 🔹 récupérer film & cinéma depuis la séance
  const [movie, cinema] = await Promise.all([
    fetchMovieById(show.movieId),
    fetchCinemaById(show.cinemaId),
  ]);

  if (!movie || !cinema) {
    return <p>Données de réservation incomplètes.</p>;
  }

  const availableSeats =
    show.room.capacite -
    (show.reservedSeats?.length ?? 0) -
    (show.room.pmrSeats ?? 0);

  const showWithSeats = {
    ...show,
    availableSeats,
  };

  return (
    <div className="flex lg:flex-row flex-col gap-8 w-full">
      {/* Résumé */}
      {/* <div className="flex-1 bg-secondary p-4 order-2">
        <ReservationSummary show={show} movie={movie} cinema={cinema} />
      </div> */}

      {/* Plan de salle */}
      <div className=" flex-1 justify-center p-4">
        <FormSeat show={showWithSeats} />
      </div>
    </div>
  );
}
