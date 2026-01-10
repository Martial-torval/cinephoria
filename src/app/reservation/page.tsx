"use client";
import { CinemaType } from "@/types/cinema";
import { MovieType } from "@/types/movie";
import CardMovie from "@/components/CardMovie";
import { fetchCinema, readAllMoviesWithShows } from "@/utils/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Instrument_Serif } from "next/font/google";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
export default function Page() {
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [isLoadingCinemas, setIsLoadingCinemas] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  // 🔹 Charger tous les cinémas
  useEffect(() => {
    const loadCinemas = async () => {
      const data = await fetchCinema();
      setCinemas(data);
      setIsLoadingCinemas(false);
    };
    loadCinemas();
  }, []);

  // 🔹 Charger les films (tous ou filtrés)
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoadingMovies(true);
      const allMovies = await readAllMoviesWithShows();
      const all = allMovies.results ?? [];

      if (!selectedCinemaId) {
        // Tous les films
        setMovies(all);
      } else {
        // Films qui ont au moins une séance dans le cinéma sélectionné
        const filtered = all.filter((movie: MovieType) =>
          movie.seances?.some(
            (s) => s.room?.cinemaId === Number(selectedCinemaId)
          )
        );
        setMovies(filtered);
      }

      setIsLoadingMovies(false);
    };
    loadMovies();
  }, [selectedCinemaId]);

  return (
    <div className="text-2xl text-secondary lg:mt-10 md:mt-5 mt-0 h-full">
      <h2
        className={`lg:text-6xl md:text-5xl text-4xl mb-10 ${instrument_serif.className}`}
      >
        Réserver un film
      </h2>
      <h3 className="lg:text-2xl md:text-xl text-lg mb-3">
        Sélectionnez un cinéma
      </h3>

      {/* 🔹 Sélecteur de cinéma */}
      {isLoadingCinemas ? (
        <p className="lg:text-lg text-base">Chargement des cinémas...</p>
      ) : (
        <div className="flex lg:w-1/6 w-3/6 border border-black">
          <select
            className="w-full p-2 text-base bg-transparent"
            value={selectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
          >
            <option value="" className="">
              Tous les cinémas
            </option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🔹 Liste des films */}
      <div className="mt-8">
        {isLoadingMovies ? (
          <p className="lg:text-lg text-base">Chargement des films...</p>
        ) : movies.length > 0 ? (
          <div
            className="grid gap-6
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
"
          >
            {movies
              // on ne garde que les films qui ont au moins une séance avec un cinéma valide
              .filter((movie) =>
                movie.seances?.some((s) => s.room?.cinemaId !== undefined)
              )
              .map((movie) => {
                // on récupère la première séance valide
                const validShow = movie.seances!.find(
                  (s) => s.room?.cinemaId !== undefined
                )!;
                const cinemaIdForLink =
                  selectedCinemaId || validShow.room!.cinemaId;
                {
                  console.log(
                    "🎬 Movie:",
                    movie.title,
                    "cinemaIdForLink:",
                    cinemaIdForLink,
                    "movieId:",
                    movie.id
                  );
                }
                return (
                  <Link
                    key={movie.id}
                    href={`/reservation/cinema/${cinemaIdForLink}/film/${movie.id}`}
                  >
                    <CardMovie
                      id={movie.id}
                      title={movie.title}
                      description={movie.description}
                      posterUrl={movie.posterUrl}
                      genre_list={movie.genre}
                      cinemaId={Number(cinemaIdForLink)}
                      seances={movie.seances}
                      className="w-full h-[420px] flex flex-col justify-end"
                    />
                  </Link>
                );
              })}
          </div>
        ) : (
          <p className="text-center mt-4 lg:text-lg text-base">
            Aucun film disponible pour ce cinéma.
          </p>
        )}
      </div>
    </div>
  );
}
