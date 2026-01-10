import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { validator } from "validation-better-auth";
import { registerSchema } from "./schemas/auth";
import { z } from "zod";
import { getTestTransporter } from "./mail";
import { sendPasswordResetEmail } from "@/utils/sendEmail";

const prisma = new PrismaClient();

// Définition des ressources et permissions pour l'access control
const statement = {
  film: ["create", "update", "delete"] as const,
  session: ["create", "update", "delete"] as const,
  review: ["validate", "delete"] as const,
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "update",
    "impersonate",
    "delete",
    "set-password",
  ] as const,
} as const;

const ac = createAccessControl(statement);

// Définition des rôles
const roles = {
  USER: ac.newRole({ film: [], session: [], review: [], user: [] }),
  EMPLOYEE: ac.newRole({
    film: ["create", "update", "delete"],
    review: ["validate"],
    session: [],
    user: [],
  }),
  ADMIN: ac.newRole({
    film: ["create", "update", "delete"],
    session: ["create", "update", "delete"],
    review: ["validate", "delete"],
    user: [
      "create",
      "list",
      "update",
      "set-role",
      "ban",
      "impersonate",
      "delete",
      "set-password",
    ],
  }),
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [
    admin({
      adminRoles: ["ADMIN"],
      defaultRole: "USER",
      ac,
      roles,
    }),
    validator([
      {
        path: "sign-up/email",
        before: async (ctx: any) => {
          try {
            const body = await ctx.request.json();
            registerSchema.parse(body); // validation Zod
          } catch (err) {
            if (err instanceof z.ZodError) {
              return new Response(
                JSON.stringify({
                  code: "VALIDATION_ERROR",
                  message: "Invalid body parameters",
                  errors: z.treeifyError(err),
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
            throw err;
          }
        },
      },
    ]),
  ],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(email) {
      await sendPasswordResetEmail(email);
    },
  },
  user: {
    additionalFields: {
      role: { type: ["USER", "ADMIN", "EMPLOYEE"] },
      firstname: { type: "string" },
      lastname: { type: "string" },
      username: { type: "string" },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendVerificationEmail: async ({ token, user }) => {
      const transporter = await getTestTransporter();
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: '"Cinephoria" <no-reply@cinephoria.com>',
        to: currentUser?.email,
        subject: "Cinephoria - Vérifiez votre adresse email",
        html: `
          <p>Bienvenue sur Cinephoria !</p>
          <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte :</p>
          <a href="${verificationUrl}">Vérifier mon email</a>
        `,
      });

      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    },
  },
});
