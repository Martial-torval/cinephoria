"use client";

import { useEffect, useState } from "react";
import { readBookingByUserId, createReview } from "@/utils/api";
import type { Booking } from "@/types/booking";
import { formatShowQuality } from "@/utils/format";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

type SessionType = {
  session: {
    id: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  };
  user: {
    id: string;
    username: string;
    role: "USER" | "EMPLOYEE" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  };
};

export default function MonEspaceClient({ session }: { session: SessionType }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState<"all" | "past" | "upcoming">("all");

  // Charger les réservations
  useEffect(() => {
    const loadBooking = async () => {
      const BookingData = await readBookingByUserId();
      setBookings(BookingData);
      setLoading(false);
    };
    loadBooking();
  }, []);

  const handleSubmitReview = async () => {
    if (!ratingModal) return;
    if (rating < 1 || rating > 5)
      return toast.error("Veuillez fournir une note entre 1 et 5 !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
    const success = await createReview({
      movieId: ratingModal.seance.movie.id,
      rate: rating,
      comment,
    });
    if (success) {
      toast.success(
        "Votre avis a été envoyé avec succès ! Un employé va valider cela sous peu.",
        {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        }
      );
      setRatingModal(null);
      setRating(0);
      setComment("");
    } else {
      toast.error(
        "Une erreur est survenue lors de l'envoi de votre avis ! :(",
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

  const now = new Date();
  const filteredBookings = bookings.filter((b) => {
    const showEnd = new Date(b.seance.endTime);
    if (filter === "past") return showEnd < now;
    if (filter === "upcoming") return showEnd >= now;
    return true;
  });

  if (loading) return <p>Chargement de vos commandes...</p>;

  return (
    <>
      <h2
        className={`lg:text-6xl md:text-5xl text-4xl my-14 ${instrument_serif.className}`}
      >
        Bienvenue dans votre espace personnel, {session.user.username} !
      </h2>

      {/* Boutons de filtre */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-1  ${
            filter === "all"
              ? "bg-secondary text-primary"
              : "border border-secondary"
          }`}
          onClick={() => setFilter("all")}
        >
          Toutes les commandes
        </button>
        <button
          className={`px-3 py-1  ${
            filter === "past"
              ? "bg-secondary text-primary"
              : "border border-secondary"
          }`}
          onClick={() => setFilter("past")}
        >
          Commandes passées
        </button>
        <button
          className={`px-3 py-1  ${
            filter === "upcoming"
              ? "bg-secondary text-primary"
              : "border border-secondary"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          Commandes à venir
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <p>Aucune commande pour ce filtre.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {filteredBookings.map((b) => {
            const showEnd = new Date(b.seance.endTime);
            const canReview = showEnd < now;

            return (
              <li key={b.id} className="border p-4  shadow-sm">
                <p>
                  <strong>Film :</strong> {b.seance.movie.title}
                </p>
                <p>
                  <strong>Séance :</strong>{" "}
                  {new Date(b.seance.startTime).toLocaleString()} →{" "}
                  {showEnd.toLocaleString()}
                </p>
                <p>
                  <strong>Qualité :</strong>{" "}
                  {formatShowQuality(b.seance.qualityProjection)}
                </p>
                <p>
                  <strong>Nombre de places :</strong> {b.numberOfSeats}
                </p>
                <p>
                  <strong>Places :</strong> {b.bookingSeats.join(", ")}
                </p>
                <p>
                  <strong>Prix :</strong> {b.totalPrice} €
                </p>

                <button
                  className="mt-2 bg-yellow-500 text-white px-3 py-1  hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => setRatingModal(b)}
                  disabled={!canReview}
                >
                  Donner votre avis
                </button>
                {!canReview && (
                  <p className="text-sm text-gray-500 mt-1">
                    Séance pas encore terminée
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6  shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">
              Donner un avis pour &quot;{ratingModal.seance.movie.title}&quot;
            </h3>

            <label className="block mb-2">
              Note (1 à 5) :
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 w-full  mt-1"
              />
            </label>

            <label className="block mb-4">
              Commentaire :
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-2 w-full  mt-1"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-3 py-1  hover:bg-gray-400"
                onClick={() => setRatingModal(null)}
              >
                Annuler
              </button>
              <button
                className="bg-secondary text-primary px-3 py-1  hover:bg-blue-700"
                onClick={handleSubmitReview}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
