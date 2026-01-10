import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth"; // Ce type est nécessaire pour inferAdditionalFields
import { RegisterInput } from "./schemas/auth"; // Import du type pour la cohérence

// --- Configuration du client unifié ---
// Nous créons un seul client qui inclut tous les plugins et les configurations nécessaires.
const betterAuthClient = createAuthClient({
  // Plugins combinés
  plugins: [
    inferAdditionalFields<typeof auth>(), // Pour les champs additionnels (SignUp)
    adminClient(), // Pour les fonctions admin et les hooks de session (useSession, signOut, etc.)
  ],
  baseURL: "http://localhost:3000",
});

// --- Exports pour l'ensemble de l'application ---
// Nous exportons toutes les méthodes directement depuis le client unifié
// pour éviter les problèmes de résolution de propriétés (comme '.useSession' ou '.signOut').
export const authClient = betterAuthClient;

// Définition de types pour la cohérence
// Le type de données d'inscription est dérivé du schéma Zod (RegisterInput) et des champs ajoutés par Better Auth (name, role).
export type SignUpData = RegisterInput & {
  name: string;
  role: string;
};
