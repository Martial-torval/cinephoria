"use client";
import { useState } from "react";
import { updateMovie } from "@/utils/api";
import { uploadFile } from "@/utils/uploadFile";
import Image from "next/image";
import { GenreEnum } from "@/utils/genre";
import { MovieType } from "@/types/movie";
import toast from "react-hot-toast";

type Props = {
  movie: MovieType;
  onClose: () => void;
  onSuccess: () => void;
};

const MINIMUM_AGES = [0, 10, 12, 16, 18];

export default function FormUpdateMovie({ movie, onClose, onSuccess }: Props) {
  // Convertit l'enum Prisma ("AGE_10") en nombre pour affichage
  const parseMinimumAge = (age?: string | number): number => {
    if (!age) return 0;
    if (typeof age === "string" && age.startsWith("AGE_")) {
      return parseInt(age.replace("AGE_", ""), 10);
    }
    return Number(age) || 0;
  };

  const [formData, setFormData] = useState({
    title: movie.title,
    description: movie.description,
    minimumAge: parseMinimumAge(movie.minimumAge),
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    movie.genre || []
  );

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectMinimumAge = (age: number) => {
    setFormData((prev) => ({ ...prev, minimumAge: age }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let posterUrl = movie.posterUrl;

    if (posterFile) {
      // On passe l'ancien fichier pour le supprimer si le poster change
      const url = await uploadFile(
        posterFile,
        movie.posterUrl?.replace("/uploads/", "uploads/") // chemin relatif côté serveur
      );
      if (!url)
        return toast.error("Erreur lors de l'upload de l'affiche du film.", {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        });
      posterUrl = url;
    }

    try {
      const updatedMovie = await updateMovie(movie.id, {
        title: formData.title,
        description: formData.description,
        minimumAge: formData.minimumAge, // toujours un nombre ici
        genre: selectedGenres,
        posterUrl,
      });

      if (updatedMovie) {
        toast.success("Le film a été mis à jour avec succès !", {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        });
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("❌ Erreur Prisma updateMovie:", err);
      toast.error("Une erreur est survenue lors de la mise à jour du film !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="title"
        placeholder="Titre"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Sélecteur d'âge minimum */}
      <div className="flex gap-2">
        {MINIMUM_AGES.map((age) => (
          <button
            type="button"
            key={age}
            onClick={() => selectMinimumAge(age)}
            className={`px-3 py-1 rounded-full border ${
              formData.minimumAge === age
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {age}+
          </button>
        ))}
      </div>

      {/* Sélecteur de genres */}
      <div className="flex flex-wrap gap-2">
        {GenreEnum.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              type="button"
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1 rounded-full border ${
                isSelected
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Upload poster */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
        className="border p-2 rounded"
      />
      {posterFile && (
        <Image
          src={URL.createObjectURL(posterFile)}
          width={128}
          height={192}
          alt="Preview"
          className="w-32 rounded"
        />
      )}

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        ✅ Sauvegarder
      </button>
    </form>
  );
}
