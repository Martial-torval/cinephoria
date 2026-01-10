"use client";
import ShowType from "@/types/show";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generatePMRSeats, getSeatsPerRow } from "@/utils/format";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
type SeatMapWithPriceProps = {
  show: ShowType;
  seatsToBook: number;
  kidTickets: number;
  regularTickets: number;
};

export default function SeatMap({
  show,
  seatsToBook,
  kidTickets,
  regularTickets,
}: SeatMapWithPriceProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const router = useRouter();

  const reservedSeats = show.reservedSeats || [];
  console.log("reservedSeats : " + reservedSeats);

  const seatsPerRow = getSeatsPerRow(show.room.capacite);
  const pmrSeats = generatePMRSeats(show.room.capacite, seatsPerRow);

  const handleClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatNumber));
    } else if (selectedSeats.length < seatsToBook) {
      setSelectedSeats((prev) => [...prev, seatNumber]);
    } else {
      toast.error(
        "Veuillez sélectionner seulement " + seatsToBook + " sièges !",
        {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        }
      );
    }
  };
  const handleValidate = () => {
    if (selectedSeats.length !== seatsToBook) {
      toast.error(
        "Veuillez sélectionner seulement " + seatsToBook + " sièges !",
        {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        }
      );
      return;
    }
    // Redirection vers la page booking avec les sièges sélectionnés
    router.push(
      `/reservation/resume?showId=${show.id}&seats=${selectedSeats.join(
        "-"
      )}&regular=${regularTickets}&kid=${kidTickets}`
    );
  };

  return (
    <>
      <div>
        <h2
          className={`lg:text-6xl md:text-5xl text-4xl  text-center  mb-10 ${instrument_serif.className}`}
        >
          Choisissez vos sièges
        </h2>
        <div className="flex flex-col gap-6 w-full">
          <div>
            <hr className="w-2/4 mx-auto" />
            <p className="text-center text-sm">Ecran</p>
          </div>
          {/* Grille centrée */}
          <div className="grid grid-cols-10 gap-2 mx-auto w-fit">
            {Array.from({ length: show.room.capacite }, (_, i) => {
              const seatNumber = i + 1;
              const isReserved = reservedSeats.includes(seatNumber);
              const isPMR = pmrSeats.includes(seatNumber);
              const isSelected = selectedSeats.includes(seatNumber);

              return (
                <button
                  key={seatNumber}
                  onClick={() => handleClick(seatNumber)}
                  disabled={isReserved || isPMR}
                  className={`lg:p-2  border ${
                    isReserved
                      ? "bg-gray-400 cursor-not-allowed"
                      : isPMR
                      ? "bg-yellow-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-secondary text-primary"
                      : "bg-primary border-black text-secondary"
                  }`}
                >
                  {seatNumber} {isPMR && "♿"}
                </button>
              );
            })}
          </div>

          <p className="text-center">
            Places : {selectedSeats.join(", ") || "aucun"}
          </p>

          {/* Bouton FULL WIDTH */}
          <button
            className="bg-secondary text-primary py-3 px-3 mx-auto"
            onClick={handleValidate}
          >
            Valider vos sièges
          </button>
        </div>
      </div>
    </>
  );
}
