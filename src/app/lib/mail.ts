"use server";
import nodemailer from "nodemailer";

let transporterPromise: ReturnType<typeof nodemailer.createTransport> | null =
  null;

export async function getTestTransporter() {
  // On évite de recréer un compte Ethereal à chaque appel
  if (!transporterPromise) {
    const testAccount = await nodemailer.createTestAccount();

    transporterPromise = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporterPromise;
}
