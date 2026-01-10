"use client";

import { useState } from "react";
import { sendContactMessage } from "@/utils/api";
import Image from "next/image";
import contactImage from "../../../public/contact.webp";
import { Instrument_Serif } from "next/font/google";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function ContactPage() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await sendContactMessage({ username, title, description });
      setMessage("✅ Votre demande a été envoyée avec succès !");
      setUsername("");
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "❌ Impossible d'envoyer votre demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-between gap-32 mt-10 p-6">
      <Image
        src={contactImage}
        alt="contact_image"
        width={500}
        height={500}
        className="lg:block md:hidden hidden"
      />
      <div className="w-full">
        <h2
          className={`${instrument_serif.className} lg:text-6xl md:text-5xl text-4xl lg:mb-24 md:mb-12 mb-6`}
        >
          Contactez l&apos;équipe de Cinéphoria !
        </h2>

        <form
          className="flex flex-col gap-4 lg:w-3/4 md:w-full w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Adresse mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 "
          />
          <input
            type="text"
            placeholder="Titre de la demande"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 "
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2  h-64"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-secondary text-primary py-2 px-4 hover:bg-primary hover:text-secondary transition-colors hover:border-black hover:border w-32 -xl"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
