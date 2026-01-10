"use client";
import { useState } from "react";
import Image from "next/image";
import CenteredModal from "@/components/Modal";
import AddMovieForm from "@/components/FormAddMovie";
import FormUpdateMovie from "@/components/FormUpdateMovie";
import { MovieType } from "@/types/movie";
import { deleteMovie } from "@/utils/api";
import { formatMinimumAge } from "@/utils/format";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
type Props = {
  movies: MovieType[];
  reloadMovies: () => void;
};

export default function MoviesSection({ movies, reloadMovies }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  return (
    <article>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary text-white py-2 px-4   hover:bg-gray-400"
      >
        ➕ Ajouter un film
      </button>

      <table className="w-full mt-4 border border-collapse">
        <thead className={`text-3xl ${instrument_serif.className}`}>
          <tr>
            <th className="border p-4">Titre</th>
            <th className="border p-4">Affiche</th>
            <th className="border p-4">Age&nbsp;min.</th>
            <th className="border p-4">Description</th>
            <th className="border p-4">Genre</th>
            <th className="border p-4">&#9829;</th>
            <th className="border p-4">Note</th>
            <th className="border p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td className="border p-4 text-xl font-bold  text-center">
                {movie.title}
              </td>
              <td className="border relative align-top">
                <Image
                  src={movie.posterUrl}
                  alt="Movie poster"
                  fill
                  className="object-cover"
                />
              </td>
              <td className="border p-4 text-center">
                {formatMinimumAge(String(movie.minimumAge))}
              </td>
              <td className="border p-4 align-top">
                <p className="line-clamp-3">{movie.description}</p>
              </td>
              <td className="border p-4 align-top">{movie.genre.join(", ")}</td>
              <td className="border p-4 align-top">
                {movie.isFavorite ? "Oui" : "Non"}
              </td>
              <td className="border p-4 align-top">{movie.rate} / 5</td>
              <td className="border p-4 align-top">
                <button
                  className="bg-secondary text-white px-3 py-1 w-full  hover:bg-yellow-600"
                  onClick={() => setSelectedMovie(movie)}
                >
                  Modifier
                </button>
                <br />
                <button
                  className="bg-primary border border-secondary text-secondary px-3 py-1  hover:bg-red-700 hover:text-primary hover:-red-700 mt-2"
                  onClick={async () => {
                    if (
                      confirm(
                        `❌ Voulez-vous vraiment supprimer "${movie.title}" ?`
                      )
                    ) {
                      const deleted = await deleteMovie(movie.id);
                      if (deleted) {
                        toast.success("✅ Film supprimé avec succès !", {
                          style: {
                            padding: "16px",
                            maxWidth: "100%",
                            borderRadius: "0px",
                          },
                        });
                        reloadMovies();
                      } else {
                        toast.error(
                          "❌ Une erreur est survenue lors de la suppression du film !",
                          {
                            style: {
                              padding: "16px",
                              maxWidth: "100%",
                              borderRadius: "0px",
                            },
                          }
                        );
                      }
                    }
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <CenteredModal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Ajouter un film</h2>
          <AddMovieForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={reloadMovies}
            key={isModalOpen ? "open" : "closed"}
          />
        </CenteredModal>
      )}

      {selectedMovie && (
        <CenteredModal onClose={() => setSelectedMovie(null)}>
          <h2 className="text-2xl font-bold mb-4">Modifier le film</h2>
          <FormUpdateMovie
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onSuccess={reloadMovies}
            key={isModalOpen ? "open" : "closed"}
          />
        </CenteredModal>
      )}
    </article>
  );
}
