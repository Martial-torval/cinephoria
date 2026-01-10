"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Instrument_Serif } from "next/font/google";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { data, error: resetError } = await authClient.requestPasswordReset(
        {
          email,
          redirectTo: `${window.location.origin}/reset-password`, // page où l'utilisateur va entrer son nouveau mot de passe
        }
      );

      if (resetError) throw resetError;

      setMessage(`Un email de réinitialisation a été envoyé à ${email}`);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de l'envoi de l'email de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto mt-8"
    >
      <h2
        className={`lg:text-6xl md:text-5xl text-4xl text-center mb-14  ${instrument_serif.className}`}
      >
        Mot de passe oublié
      </h2>
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-secondary text-primary py-2"
      >
        {loading ? "Envoi..." : "Envoyer le lien"}
      </button>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
