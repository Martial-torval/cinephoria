"use client";
import { useState } from "react";
import { createMovie } from "@/utils/api";
import { uploadFile } from "@/utils/uploadFile";
import Image from "next/image";
import { GenreEnum } from "@/utils/genre";
import toast from "react-hot-toast";

interface AddMovieFormProps {
  onSuccess?: () => void;
  onClose: () => void;
}

const MINIMUM_AGES = [0, 10, 12, 16, 18];

export default function AddMovieForm({
  onSuccess,
  onClose,
}: AddMovieFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    minimumAge: 0, // valeur par défaut
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectMinimumAge = (age: number) => {
    setFormData((prev) => ({ ...prev, minimumAge: age }));
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let posterUrl = "";
    if (posterFile) {
      const url = await uploadFile(posterFile);
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

    // ✅ conversion en format d’enum pour Prisma
    const minimumAgeEnum = `${formData.minimumAge}`;

    const newMovie = await createMovie({
      ...formData,
      minimumAge: minimumAgeEnum, // <-- conversion ici
      posterUrl,
      genre: selectedGenres,
    });

    if (newMovie) {
      toast.success("Le film a été ajouté avec succès !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
      setFormData({ title: "", description: "", minimumAge: 0 });
      setSelectedGenres([]);
      setPosterFile(null);
      onSuccess?.();
      onClose();
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

      {/* Sélection des âges minimum */}
      <div className="flex gap-2 flex-wrap">
        {MINIMUM_AGES.map((age) => (
          <button
            type="button"
            key={age}
            onClick={() => selectMinimumAge(age)}
            className={`px-3 py-1 rounded-full border ${
              formData.minimumAge === age
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {age}+
          </button>
        ))}
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-2">
        {GenreEnum.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              type="button"
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1 rounded-full border ${
                isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
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
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Ajouter le film
      </button>
    </form>
  );
}
