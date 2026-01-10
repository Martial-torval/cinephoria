"use client";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { motion } from "motion/react";
import { CinemaType } from "@/types/cinema";
import ShowType from "@/types/show";
import { formatMinimumAge } from "@/utils/format";

const instrument_sans = Instrument_Sans({ weight: "400", subsets: ["latin"] });
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
export interface CardMovieType {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  genre_list?: string[] | { id: number; name: string }[];
  minimumAge?: number;
  releaseDate?: string;
  isAdult?: boolean;
  className?: string;
  isFavorite: boolean;
  descriptionClassName?: string;
  qualityProjection?: string;
  cinemas?: CinemaType[];
  cinemaId?: string;
  seances?: ShowType[];
  rating?: number;
}
export default function CardMovie({
  title,
  description,
  posterUrl,
  genre_list,
  className,
  descriptionClassName,
  rating,
  isFavorite,
  minimumAge,
}: CardMovieType) {
  return (
    <article
      className={`relative bg-cover bg-center ${className} ${instrument_sans.className}`}
      style={{ backgroundImage: `url(${posterUrl || "/placeholder.jpg"})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="relative z-10 h-full flex flex-col justify-end gap-4 lg:p-6 md:p-6 p-2 text-primary hover:scale-105 lg:text-xl md:text-lg text-base"
      >
        <h2
          className={
            instrument_serif.className +
            " line-clamp-2 lg:text-6xl md:text-5xl text-4xl"
          }
        >
          {title}
        </h2>

        <div className="flex lg:flex-row md:flex-row flex-col lg:items-center md:items-center items-start gap-3">
          <p>
            {rating} / 5 <span className="text-xl"> &#9733; </span>
          </p>
          {genre_list && genre_list.length > 0 && (
            <>
              <span className="mt-[0.5] w-1 h-1 rounded-full bg-primary lg:block md:block hidden" />

              <ul className="flex flex-wrap gap-2">
                {genre_list.map((genre, index) => {
                  const genreName =
                    typeof genre === "string" ? genre : genre.name;
                  return (
                    <li
                      key={
                        typeof genre === "string" ? genre : genre.id ?? index
                      }
                      className="text-primary"
                    >
                      {genreName}
                    </li>
                  );
                })}
              </ul>
              <span className="mt-[0.5] w-1 h-1 rounded-full bg-primary lg:block md:block hidden " />
            </>
          )}
          {minimumAge && (
            <span className="text-primary">
              {formatMinimumAge(String(minimumAge))}
            </span>
          )}
        </div>
        <p className={`${descriptionClassName} line-clamp-3`}>{description}</p>

        <p>
          {isFavorite && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="#EF4444"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              <path d="M12 21s-8-5.35-8-10.1C4 6.9 7.5 4 10.5 6c1 .8 1.5 2 1.5 2s.5-1.2 1.5-2C16.5 4 20 6.9 20 10.9 20 15.65 12 21 12 21z" />
            </svg>
          )}
        </p>
      </motion.div>
    </article>
  );
}
