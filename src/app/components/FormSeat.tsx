"use client";
import { useState } from "react";
import SeatMap from "@/components/SeatMap";
import ShowType from "@/types/show";
import { formatShowQuality } from "@/utils/format";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

type SeatMapWithPriceProps = {
  show: ShowType & { availableSeats: number };
};

export default function FormSeat({ show }: SeatMapWithPriceProps) {
  const [regularTickets, setRegularTickets] = useState<number>(0);
  const [kidTickets, setKidTickets] = useState<number>(0);
  const [seatsToBook, setSeatsToBook] = useState<number | null>(null);

  if (show.availableSeats <= 0) {
    return (
      <p className="text-center text-muted">
        Aucune place disponible pour cette séance.
      </p>
    );
  }

  const getPriceByQuality = (quality: string) => {
    switch (formatShowQuality(quality)) {
      case "3D":
        return 13;
      case "4DX":
        return 18;
      case "IMAX":
      case "4K":
        return 15;
      case "Standard":
      default:
        return 10;
    }
  };

  const pricePerRegular = getPriceByQuality(show.qualityProjection);
  const pricePerKid = pricePerRegular - 6;

  const totalPrice =
    kidTickets * pricePerKid + regularTickets * pricePerRegular;

  const handleTicketChange = (type: "kid" | "regular", value: number) => {
    value = Math.max(0, value); // pas de valeur négative
    let newKid = kidTickets;
    let newRegular = regularTickets;

    if (type === "kid") newKid = value;
    else newRegular = value;

    // Limiter le total au nombre de places disponibles
    if (newKid + newRegular > show.availableSeats) {
      if (type === "kid") newKid = show.availableSeats - newRegular;
      else newRegular = show.availableSeats - newKid;
    }

    setKidTickets(newKid);
    setRegularTickets(newRegular);
  };

  if (!seatsToBook) {
    return (
      <form
        className="flex flex-col items-center gap-4 h-full lg:mt-16 mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          const totalTickets = kidTickets + regularTickets;
          if (totalTickets < 1) {
            toast.error("Veuillez sélectionner au moins un ticket !", {
              style: {
                padding: "16px",
                maxWidth: "100%",
                borderRadius: "0px",
              },
            });
            return;
          }
          setSeatsToBook(totalTickets);
        }}
      >
        <div>
          <h2
            className={`lg:text-6xl md:text-5xl text-4xl lg:text-start md:text-start mb-4  ${instrument_serif.className}`}
          >
            Combien de places souhaitez-vous réserver ?
          </h2>
          <p className="lg:text-center text-start">
            Places disponibles : <br className="lg:block hidden" />
            <span className="font-bold">{show.availableSeats}</span>
          </p>
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col gap-10 my-5">
          <div className="border border-secondary p-4 w-auto flex flex-col">
            <label htmlFor="normal_ticket" className="flex flex-col">
              <span className={`text-3xl mb-5 ${instrument_serif.className}`}>
                Tarif normal
              </span>
              <span>
                {formatShowQuality(show.qualityProjection)} ({show.movie.title})
              </span>
            </label>
            <p className="mb-24">{pricePerRegular}€</p>
            <input
              type="number"
              id="normal_ticket"
              placeholder="Nombre de places"
              className="border p-2  w-64 text-center appearance-auto"
              value={regularTickets}
              onChange={(e) =>
                handleTicketChange("regular", Number(e.target.value))
              }
            />
          </div>
          <div className=" border border-secondary p-4 w-auto flex flex-col">
            <label htmlFor="kid_ticket" className="flex flex-col">
              <span className={`text-3xl mb-5 ${instrument_serif.className}`}>
                Tarif -14 ans
              </span>
              <span>
                {formatShowQuality(show.qualityProjection)} ({show.movie.title})
              </span>
            </label>
            <p className="mb-24">{pricePerKid}€</p>
            <input
              type="number"
              id="kid_ticket"
              placeholder="Nombre de places"
              className="border p-2  w-64 text-center appearance-auto"
              value={kidTickets}
              onChange={(e) =>
                handleTicketChange("kid", Number(e.target.value))
              }
            />
          </div>
        </div>
        <div className="">
          <button
            type="submit"
            className="bg-primary mx-auto  text-secondary border border-secondary px-4 py-2 mt-4 hover:bg-secondary hover:text-primary transition-colors"
          >
            Total = {totalPrice}€ <br />{" "}
            <span className="font-bold">Valider</span>
          </button>
        </div>
      </form>
    );
  }

  // Affichage du SeatMap
  return (
    <SeatMap
      show={show}
      seatsToBook={seatsToBook}
      regularTickets={regularTickets}
      kidTickets={kidTickets}
    />
  );
}
