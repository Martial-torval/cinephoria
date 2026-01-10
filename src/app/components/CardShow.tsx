"use client";

import { Instrument_Sans } from "next/font/google";
import Link from "next/link";

const instrument_sans = Instrument_Sans({ weight: "400", subsets: ["latin"] });

type CardShowProps = {
  id: number;
  capacity: number;
  quality: string;
  startTime: string;
  endTime: string;
  room: { availableSeat: number; number: number };
  price?: string | number;
  link?: string; // ✅ nouvelle prop
};

export default function CardShow({
  quality,
  startTime,
  endTime,
  room,
  price,
  link,
}: CardShowProps) {
  const content = (
    <div className="h-full flex flex-col justify-between w-40 border lg:mr-2 md:mr-2 mr-1 border-secondary p-3 hover:bg-secondary hover:text-primary transition-colors cursor-pointer">
      <span className="text-sm p-1">Salle {room.number}</span>
      <div className="text-center">
        <h4 className="text-2xl font-bold">{startTime}</h4>
        <h4 className="text-sm">(Fin : {endTime})</h4>
      </div>
      <div>
        <span>{quality}</span>
        {/* <p>
        <span className="text-red-600">{room.availableSeat}</span> places
        restantes
      </p> */}
        <p className="mt-1 text-sm ">À partir de {price}€</p>
      </div>
    </div>
  );

  // ✅ si un lien est fourni, on wrap avec Link, sinon juste la carte
  return (
    <article
      className={`relative bg-cover bg-center h-full ${instrument_sans.className}`}
    >
      {link ? (
        <Link href={link} className="h-full block">
          {content}
        </Link>
      ) : (
        content
      )}
    </article>
  );
}
