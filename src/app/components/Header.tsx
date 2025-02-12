"use client";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import Hamburger from "hamburger-react";
import { useState } from "react";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const tabletDevice = useMediaQuery("(max-width: 992px)");
  return (
    <header className="flex justify-between items-center text-secondary">
      <Link href={"/"}>
        <h1
          className={
            instrument_serif.className + " text-7xl lg:block md:hidden hidden"
          }
        >
          Cinephoria
        </h1>
      </Link>
      {!tabletDevice ? (
        <nav>
          <ul
            className={
              instrument_serif.className + " flex gap-4 lg:text-5xl text-3xl"
            }
          >
            <Link href={"/films"}>Films</Link>
            <Link href={"/reservation"}>Réservations</Link>
            <Link href={"/contact"}>Contact</Link>
            <Link href={"/inscription"}>Inscription</Link>
            <Link href={"/connexion"}>Connexion</Link>
          </ul>
        </nav>
      ) : (
        <>
          <h1 className={instrument_serif.className + " text-5xl"}>
            Cinephoria
          </h1>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </>
      )}
    </header>
  );
}
