import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { motion } from "motion/react";
import Link from "next/link";

const instrument_sans = Instrument_Sans({ weight: "400", subsets: ["latin"] });
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

type CardCinemaProps = {
  id: number;
  name: string;
  posterUrl: string;
};

export default function CardCinema({ id, name, posterUrl }: CardCinemaProps) {
  return (
    <article
      key={id}
      className={`relative bg-cover bg-center ${instrument_sans.className}`}
      style={{ backgroundImage: `url(${posterUrl})` }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="relative z-10 p-6 text-white flex flex-col h-full justify-end items-center gap-4"
      >
        <h3
          className={
            instrument_serif.className +
            " lg:text-6xl md:text-4xl text-3xl text-center"
          }
        >
          {name}
        </h3>
        <Link href={`/reservation/cinema/${id}`}>
          <button className="lg:text-xl md:text-xl text-lg bg-primary text-secondary border border-black lg:w-64 md:w-64 w-48">
            Sélectionner ce cinéma
          </button>
        </Link>
      </motion.div>
    </article>
  );
}
