"use client";
// Swiper.JS
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
// Hook
import { useEffect, useState } from "react";
// Types
import { MovieType } from "../types/movie";
// Next.js Image
import Image from "next/image";
import CardMovie from "./CardMovie";
import { Instrument_Serif } from "next/font/google";
import { fetchMovies } from "../utils/api";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function MovieCarousel() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      const moviesData = await fetchMovies();
      setMovies(moviesData);
      setLoading(false);
    };
    loadMovies();
  }, []);

  if (loading)
    return <p className="text-center text-xl">Chargement des films...</p>;

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        modules={[Pagination]}
        loop
        autoplay
        className="relative"
        onSwiper={setSwiperInstance}
      >
        {movies.slice(7).map((movie) => (
          <SwiperSlide key={movie.id} className="h-full">
            <CardMovie
              className="p-4 bg-no-repeat bg-cover text-primary w-full flex flex-col justify-end relative h-[70vh]"
              id={movie.id}
              title={movie.title}
              releaseDate={movie.releaseDate}
              description={movie.description}
              descriptionClassName="lg:text-2xl text-base lg:w-1/2 md:w-2/3"
              createdAt={movie.createdAt}
              posterUrl={movie.backdropPath}
              voteAverage={movie.voteAverage}
              isAdult={movie.isAdult}
              minimumAge={movie.minimumAge}
              genre_list={movie.genre_list}
              backdropPath={movie.backdropPath}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex gap-2 mt-4 lg:flex-row md:flex-col flex-col lg:items-start md:items-start">
        <h4
          className={
            instrument_serif.className +
            " text-secondary lg:text-4xl md:text-4xl text-2xl mr-3"
          }
        >
          Derniers films ajoutés :
        </h4>
        <div>
          {movies.slice(7).map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => swiperInstance?.slideTo(index)} // Change de slide au clic
              className="w-16 h-24 relative rounded-md overflow-hidden border-2 border-transparent hover:border-white transition"
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
