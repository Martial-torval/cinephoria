"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await authClient.signIn.email(
        { email, password, rememberMe: false },
        {
          onRequest: () => setLoading(true),
          onSuccess: async () => {
            setLoading(false);
            const session = await authClient.getSession();

            if ("data" in session && session.data?.user) {
              const role = session.data.user.role;
              if (callbackUrl && callbackUrl !== "/") {
                router.replace(callbackUrl);
                return;
              }
              switch (role) {
                case "ADMIN":
                  router.replace("/admin");
                  break;
                case "EMPLOYEE":
                  router.replace("/intranet");
                  break;
                default:
                  router.replace("/mon-espace");
              }
            } else {
              setError("Impossible de récupérer la session utilisateur.");
            }
          },
          onError: (ctx) => {
            setLoading(false);
            setError(ctx.error.message);
          },
        }
      );
    } catch (err) {
      setLoading(false);
      setError("Une erreur inattendue est survenue.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary w-full flex flex-col">
      <h2
        className={`lg:text-6xl md:text-5xl text-4xl text-center mb-14  ${instrument_serif.className}`}
      >
        Connexion
      </h2>

      {/* Email */}
      <div className="my-3 flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="border border-black  px-4 py-2"
          required
        />
      </div>

      {/* Password */}
      <div className="my-3 flex flex-col">
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          name="password"
          id="password"
          className="border border-black  px-4 py-2"
          required
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-secondary text-primary px-4 py-2  w-2/3 mx-auto"
      >
        {loading ? "Connexion..." : "Connexion"}
      </button>

      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

      {/* Lien mot de passe oublié */}
      <div className="mt-14">
        <p className=" text-center">
          <Link href="/forgot-password" className="underline text-sm">
            Mot de passe oublié ?
          </Link>
        </p>

        {/* Lien vers inscription */}
        <p className="text-center">
          <Link href="/inscription" className="underline text-sm">
            Pas encore de compte ? Inscrivez-vous !
          </Link>
        </p>
      </div>
    </form>
  );
}
