// lib/schemas/movie.schema.ts
import { z } from "zod";
export const minimumAgeValues = [
  "AGE_0",
  "AGE_10",
  "AGE_12",
  "AGE_16",
  "AGE_18",
] as const;

export const movieSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  minimumAge: z.enum(minimumAgeValues, {
    message: "L'âge minimum doit être 0, 10, 12, 16 ou 18",
  }),
  genreIds: z
    .array(z.number())
    .min(1, { message: "Au moins un genre doit être sélectionné" }),
  posterUrl: z.url({ message: "Le poster doit être une URL valide" }),
  isFavorite: z.boolean().optional(),
  rate: z.number().min(0).max(5).optional(),
});
