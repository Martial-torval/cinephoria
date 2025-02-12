"use client";
import FilterButton from "@components/FilterButton";
import { MovieType } from "../types/movie";
import { useEffect, useState } from "react";
import { fetchMovies } from "app/utils/api";
import CardMovie from "@components/CardMovie";

export default function MoviePage() {
  const [movies, setMovies] = useState<MovieType[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      const moviesData = await fetchMovies();
      setMovies(moviesData);
    };

    loadMovies();
  }, []);
  return (
    <section className="text-secondary flex flex-col justify-center">
      <FilterButton />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-rows-3 gap-4 mt-4">
        {movies.map((movie: MovieType) => (
          <>
            <CardMovie
              id={movie.id}
              title={movie.title}
              releaseDate={movie.releaseDate}
              description={movie.description}
              descriptionClassName="w-full"
              createdAt={movie.createdAt}
              posterUrl={movie.backdropPath}
              voteAverage={movie.voteAverage}
              isAdult={movie.isAdult}
              minimumAge={movie.minimumAge}
              genre_list={movie.genre_list}
              backdropPath={movie.backdropPath}
              key={movie.id}
              className="flex flex-col justify-end"
            />
          </>
        ))}
      </div>
    </section>
  );
}
