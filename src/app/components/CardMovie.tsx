import { MovieType } from "../types/movie";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { motion } from "motion/react";

const instrument_sans = Instrument_Sans({ weight: "400", subsets: ["latin"] });
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

// const dateFormat = (date: string | Date | undefined) => {
//   if (!date) {
//     return "Date invalide"; // ou toute autre valeur par défaut ou message
//   }
//   const dateObj = new Date(date);
//   const formattedDate = new Intl.DateTimeFormat("fr-FR", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(dateObj);
//   return formattedDate;
// };
export default function CardMovie({
  title,
  // voteAverage,
  // releaseDate,
  // minimumAge,
  description,
  posterUrl,
  // genre_list,
  className,
  key,
  descriptionClassName,
}: MovieType) {
  return (
    <article
      key={key}
      className={`relative bg-cover bg-center ${className} ${instrument_sans.className}`}
      style={{ backgroundImage: `url(${posterUrl})` }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenu qui doit rester visible */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="relative z-10 p-6 text-white flex flex-col gap-4"
      >
        <h3
          className={
            instrument_serif.className + " lg:text-6xl md:text-4xl text-3xl"
          }
        >
          {title}
        </h3>
        {/* <div className="flex gap-3">
          <span>{voteAverage}</span>
          <span>{genre_list}</span>
          <span>{releaseDate}</span>
          <span>{minimumAge}</span>
        </div> */}
        <p className={descriptionClassName}>{description}</p>
        {/* <p className="text-xl">Ajouté le : {dateFormat(createdAt)}</p> */}
        <button className="lg:text-xl md:text-xl text-lg bg-primary text-secondary border border-black lg:w-64 md:w-64 w-48">
          Réserver une séance
        </button>
      </motion.div>
    </article>
  );
}
