"use client";
import { useEffect, useState } from "react";
import { MovieType } from "../types/movie";
import { CinemaType } from "../types/cinema";
import { fetchCinema, fetchMovies } from "@/utils/api";
import CardMovie from "@/components/CardMovie";
import FilterButton from "@/components/FilterButton";
import Link from "next/link";
import { slugify } from "@/utils/format";

export default function Page() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  useEffect(() => {
    if (movies.length) {
      console.log("=== sample movie[0] ===");
      console.log(movies[0]);
      console.log(
        "movie[0].cinemas =",
        JSON.stringify(movies[0]?.cinemas, null, 2)
      );
      console.log(
        "movie[0].seances =",
        JSON.stringify(movies[0]?.seances?.slice(0, 5), null, 2)
      );
    }
    console.log("cinemas list:", cinemas);
  }, [movies, cinemas]);
  // Charger les cinémas
  useEffect(() => {
    const loadCinemas = async () => {
      const data = await fetchCinema();
      setCinemas(data);
    };
    loadCinemas();
  }, []);

  // Charger les films
  useEffect(() => {
    const loadMovies = async () => {
      const moviesData = await fetchMovies();
      setMovies(moviesData);
      setFilteredMovies(moviesData);
    };
    loadMovies();
  }, []);

  // Filtrage
  useEffect(() => {
    const filtered = movies.filter((movie) => {
      const matchesCinema =
        selectedCinema === null ||
        movie.seances?.some((s) => s.room?.cinema?.id === selectedCinema);

      const matchesGenre =
        selectedGenre === null || movie.genre?.includes(selectedGenre);

      const matchesDate =
        selectedDay === null ||
        movie.seances?.some((s) => s.startTime.startsWith(selectedDay));

      return matchesCinema && matchesGenre && matchesDate;
    });

    setFilteredMovies(filtered);
    console.log(filtered);
  }, [movies, selectedCinema, selectedGenre, selectedDay]);

  return (
    <section className="text-secondary flex flex-col justify-center">
      <FilterButton
        cinemas={cinemas}
        onCinemaChange={setSelectedCinema}
        onGenreChange={setSelectedGenre}
        onDayChange={setSelectedDay}
      />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-4">
        {filteredMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`/films/${slugify(movie.title)}?movieId=${movie.id}`}
          >
            <CardMovie
              id={movie.id}
              title={movie.title}
              description={movie.description}
              posterUrl={movie.posterUrl}
              minimumAge={movie.minimumAge}
              isAdult={movie.isAdult}
              genre_list={movie.genre}
              isFavorite={movie.isFavorite}
              rate={movie.rating}
              className="h-96 flex flex-col justify-end"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
