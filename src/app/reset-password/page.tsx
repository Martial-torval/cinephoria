"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Instrument_Serif } from "next/font/google";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    setToken(tokenFromUrl);
    if (!tokenFromUrl) {
      setError("Token manquant ou invalide.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: resetError } = await authClient.resetPassword({
        token,
        newPassword,
      });

      if (resetError) throw resetError;

      setMessage("Mot de passe réinitialisé avec succès !");
      // Optionnel : rediriger vers login après un délai
      setTimeout(() => router.push("/connexion"), 2000);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-xl mx-auto mt-8"
    >
      <h2
        className={`lg:text-6xl md:text-5xl text-4xl text-center ${instrument_serif.className}`}
      >
        Réinitialiser le mot de passe
      </h2>

      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="border p-2"
      />

      <button
        type="submit"
        disabled={loading || !token}
        className="bg-secondary text-primary py-2"
      >
        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </button>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
