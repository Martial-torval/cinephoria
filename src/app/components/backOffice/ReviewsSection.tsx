"use client";
import Image from "next/image";
import { ReviewType } from "@/types/review";
import { refuseReview, validateReview } from "@/utils/api";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
  reviews: ReviewType[];
  reloadReviews: () => void;
};

export default function ReviewsSection({ reviews, reloadReviews }: Props) {
  return (
    <article>
      <h3 className="text-2xl mb-4">🎬 Gérer les avis</h3>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className={`text-3xl ${instrument_serif.className}`}>
          <tr>
            <th className="border p-2">Nom de l&apos;utilisateur</th>
            <th className="border p-2">Film</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Avis</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Date d&apos;ajout</th>
            <th className="border p-2">Date de modification</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="text-center">
              <td className="border p-2 text-xl font-bold">
                {review.user.username}
              </td>
              <td className="border">
                {review.movie.title}
                <Image
                  src={review.movie.posterUrl}
                  alt="Movie poster"
                  width={300}
                  height={300}
                />
              </td>
              <td className="border p-2">{review.rating}/ 5</td>
              <td className="border p-2">{review.comment}</td>
              <td className="border p-2">{review.statut}</td>
              <td className="border p-2">{review.createdAt} </td>
              <td className="border p-2">{review.updatedAt} </td>
              <td className="border p-2">
                <br />
                <button
                  className="bg-secondary border border-secondary text-white px-3 py-1 mr-3  hover:bg-green-600 hover:border-green-600"
                  onClick={async () => {
                    if (confirm(`✅ Voulez-vous valider cet avis ?`)) {
                      const ok = await validateReview(review.id);
                      if (ok) {
                        toast.success("✅ Avis validé avec succès !", {
                          style: {
                            padding: "16px",
                            maxWidth: "100%",
                            borderRadius: "0px",
                          },
                        });
                        reloadReviews();
                      } else
                        toast.error(
                          "❌ Une erreur est survenue lors de la validation de l'avis !",
                          {
                            style: {
                              padding: "16px",
                              maxWidth: "100%",
                              borderRadius: "0px",
                            },
                          }
                        );
                    }
                  }}
                >
                  Valider
                </button>

                <button
                  className="bg-primary border border-secondary text-secondary  ml-3 px-3 py-1  hover:bg-red-700 hover:border-red-700 hover:text-primary hover:-red-700 mt-2"
                  onClick={async () => {
                    if (confirm(`❌ Voulez-vous refuser cet avis ?`)) {
                      const ok = await refuseReview(review.id);
                      if (ok) {
                        toast.success("❌ Avis refusé avec succès !", {
                          style: {
                            padding: "16px",
                            maxWidth: "100%",
                            borderRadius: "0px",
                          },
                        });
                        reloadReviews();
                      } else
                        toast.error(
                          "❌ Une erreur est survenue lors du refus de l'avis !",
                          {
                            style: {
                              padding: "16px",
                              maxWidth: "100%",
                              borderRadius: "0px",
                            },
                          }
                        );
                    }
                  }}
                >
                  Refuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
