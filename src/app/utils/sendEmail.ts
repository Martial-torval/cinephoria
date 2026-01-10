import nodemailer from "nodemailer";
import { getTestTransporter } from "@/lib/mail";

export async function sendPasswordResetEmail({
  user,
  url,
  token,
}: {
  user: any;
  url: string;
  token: string;
}) {
  const transporter = await getTestTransporter();
  const info = await transporter.sendMail({
    from: '"Cinephoria" <no-reply@cinephoria.com>',
    to: user.email, // ⚠️ user.email, pas juste email
    subject: "Réinitialisation du mot de passe",
    html: `
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour le modifier :</p>
      <a href="${url}?token=${token}">${url}?token=${token}</a>
    `,
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
