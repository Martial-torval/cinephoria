"use client";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { useEffect, useState } from "react";
import { MovieType } from "@/types/movie";
import Image from "next/image";
import CardMovie from "./CardMovie";
import { Instrument_Serif } from "next/font/google";
import { fetchMovies } from "@/utils/api";
import Link from "next/link";
import { slugify } from "@/utils/format";

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
      setLoading(true);
      const moviesData = (await fetchMovies()) as MovieType[];
      setMovies(moviesData);
      console.log("moviesData:", moviesData);
      setLoading(false);
    };
    loadMovies();
  }, []);

  if (loading)
    return <p className="text-center text-xl">Chargement des films...</p>;
  if (movies.length === 0) return <p>Aucun film disponible.</p>;

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={false}
        // autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="relative"
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        onSwiper={(sw) => setSwiperInstance(sw)}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="h-full">
            <Link
              href={`/films/${slugify(movie.title)}?movieId=${movie.id}`}
              className="h-full"
            >
              <CardMovie
                className="p-4 bg-no-repeat bg-cover text-primary w-full flex flex-col justify-end relative h-[70vh]"
                id={movie.id}
                title={movie.title}
                description={movie.description}
                descriptionClassName="lg:text-2xl text-base lg:w-1/2 md:w-2/3"
                posterUrl={movie.posterUrl}
                isAdult={movie.isAdult}
                minimumAge={movie.minimumAge}
                genre_list={movie.genre}
                isFavorite={movie.isFavorite}
                rating={movie.rating}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex gap-2 mt-4 whitespace-nowrap lg:flex-row md:flex-col flex-col lg:items-start md:items-start ">
        <h4
          className={
            instrument_serif.className +
            " text-secondary lg:text-4xl md:text-4xl text-2xl mr-3"
          }
        >
          Derniers films ajoutés :
        </h4>

        <div
          className="flex gap-2 w-full max-w-full overflow-x-auto overflow-y-hidden"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => swiperInstance?.slideToLoop(index)}
              className="flex-shrink-0 lg:w-16 md:w-24 w-24 h-24 relative rounded-md border-2 border-transparent hover:border-white transition"
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                style={{ objectFit: "cover" }}
                className="rounded-md"
                fill
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
