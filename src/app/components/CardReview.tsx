"use client";

import { ReviewType } from "@/types/review";
import { readReviewsByMovieId } from "@/utils/api";
import { Instrument_Serif } from "next/font/google";
import { useEffect, useState } from "react";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function CardReview({ movieId }: { movieId: number }) {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await readReviewsByMovieId(movieId);
      setReviews(data);
      setLoading(false);
    };
    loadReviews();
  }, [movieId]);

  if (loading) return <p>Chargement des avis...</p>;

  return (
    <div>
      <h2
        className={`${instrument_serif.className} lg:text-6xl md:text-5xl text-4xl mt-20 mb-5`}
      >
        Avis des spectateurs
      </h2>
      {reviews.length === 0 ? (
        <p>Aucun avis pour ce film.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="border p-4 rounded-lg">
              <p className="font-semibold">{r.user.username}</p>
              <p className="text-yellow-500">⭐ {r.rating}/5</p>
              <p className="italic text-gray-600 mt-1">
                &quot;{r.comment}&quot;
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
