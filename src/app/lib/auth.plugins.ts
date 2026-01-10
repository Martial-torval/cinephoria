// lib/auth.plugins.ts
import { z } from "zod";
import type {
  BetterAuthPlugin,
  HookEndpointContext,
  MiddlewareInputContext,
} from "better-auth/server";

// Schéma Zod
export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Doit contenir une majuscule")
    .regex(/[a-z]/, "Doit contenir une minuscule")
    .regex(/\d/, "Doit contenir un chiffre")
    .regex(/[^A-Za-z0-9]/, "Doit contenir un caractère spécial"),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().min(1),
});

// Plugin
export const registerValidationPlugin: BetterAuthPlugin = {
  id: "register-validation",
  hooks: {
    before: [
      {
        // matcher pour n’appliquer ce hook que sur la route signUp email
        matcher: (ctx: HookEndpointContext) =>
          ctx.endpoint === "signUp" && ctx.method === "email",
        handler: async (ctx: MiddlewareInputContext<any>) => {
          const result = registerSchema.safeParse(ctx.input);
          if (!result.success) {
            throw new Error(
              "Validation échouée : " +
                result.error.issues.map((i) => i.message).join(", ")
            );
          }
          return ctx.input; // retour obligatoire pour continuer
        },
      },
    ],
  },
};
