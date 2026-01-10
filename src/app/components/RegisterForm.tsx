"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import CenteredModal from "@/components/Modal";
import { registerSchema } from "@/lib/schemas/auth";
import z from "zod";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

type ValidationErrors = Partial<
  Record<keyof z.infer<typeof registerSchema>, string>
>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const input = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      password: formData.get("password") as string,
    };

    const result = registerSchema.safeParse(input);
    if (!result.success) {
      const zodErrors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ValidationErrors;
        zodErrors[key] = issue.message;
      });
      setValidationErrors(zodErrors);
      setLoading(false);
      return;
    }

    const { email, password, firstname, lastname, username } = result.data;
    const name = `${firstname} ${lastname}`;

    try {
      await authClient.signUp.email(
        { email, password, firstname, lastname, username, name, role: "USER" },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            setShowModal(true);
            setUserEmail(email);
          },
          onError: (ctx) => {
            setLoading(false);
            setError(ctx.error.message);
            toast.error("Erreur lors de l'inscription : " + ctx.error.message);
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
    <>
      {showModal && (
        <CenteredModal onClose={() => setShowModal(false)}>
          <h3 className="text-center text-lg font-semibold text-secondary">
            Vérifiez votre email
          </h3>
          <div className="text-center">
            <p className="mt-2">
              Un email de confirmation a été envoyé à <br />
              <span className="font-bold text-xl">{userEmail}</span>.
            </p>
            <p>Cliquez sur le lien pour activer votre compte.</p>
          </div>
        </CenteredModal>
      )}

      <div className="w-full h-full flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white  w-full max-w-md flex flex-col"
        >
          <h2
            className={`lg:text-6xl md:text-5xl text-4xl text-center mb-7  ${instrument_serif.className}`}
          >
            Inscription
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
            {validationErrors.email && (
              <p className="text-red-500">{validationErrors.email}</p>
            )}
          </div>

          {/* Username */}
          <div className="my-3 flex flex-col">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              id="username"
              className="border border-black  px-4 py-2"
              required
            />
            {validationErrors.username && (
              <p className="text-red-500">{validationErrors.username}</p>
            )}
          </div>

          {/* Prénom */}
          <div className="my-3 flex flex-col">
            <label htmlFor="firstname">Prénom</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="border border-black  px-4 py-2"
              required
            />
            {validationErrors.firstname && (
              <p className="text-red-500">{validationErrors.firstname}</p>
            )}
          </div>

          {/* Nom */}
          <div className="my-3 flex flex-col">
            <label htmlFor="lastname">Nom</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="border border-black  px-4 py-2"
              required
            />
            {validationErrors.lastname && (
              <p className="text-red-500">{validationErrors.lastname}</p>
            )}
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
            {validationErrors.password && (
              <p className="text-red-500">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-secondary text-primary px-4 py-2  w-2/3 mx-auto"
          >
            {loading ? "Inscription..." : "Inscription"}
          </button>

          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

          <p className="mt-8 text-center">
            <Link href="/connexion" className="underline text-sm">
              Vous avez déjà un compte ? Connectez-vous !
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
