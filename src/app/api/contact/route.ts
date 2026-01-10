import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getTestTransporter } from "@/lib/mail";

interface ContactBody {
  username?: string;
  title: string;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactBody = await req.json();

    const transporter = await getTestTransporter();

    const info = await transporter.sendMail({
      from: `"Cinéphoria Contact" <no-reply@cinephoria.com>`,
      to: "contact@cinephoria.com", // mail générique de Cinéphoria
      subject: `[Contact] ${body.title}`,
      html: `
        <p><strong>Nom d'utilisateur :</strong> ${
          body.username || "Non renseigné"
        }</p>
        <p><strong>Titre :</strong> ${body.title}</p>
        <p><strong>Description :</strong></p>
        <p>${body.description}</p>
      `,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({ message: "Email envoyé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'envoi du mail :", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer le mail" },
      { status: 500 }
    );
  }
}
