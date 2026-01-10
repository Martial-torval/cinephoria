import { z } from "zod";

// Regex pour le mot de passe :
// Minimum 8 caractères, au moins une majuscule, une minuscule, un chiffre et un caractère spécial
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const registerSchema = z.object({
  email: z.email("Email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      passwordRegex,
      "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
  firstname: z
    .string()
    .min(1, "Le prénom est obligatoire")
    .max(50, "Le prénom est trop long"),
  lastname: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(50, "Le nom est trop long"),
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(30, "Le nom d'utilisateur est trop long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
