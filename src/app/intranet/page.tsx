// app/intranet/page.tsx
import { forbidden, unauthorized } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import IntranetClient from "@/components/backOffice/IntranetEmployee";

export default async function IntranetPage() {
  // récupérer les headers côté serveur
  const hdrs = await headers();
  const headersObj = new Headers();
  hdrs.forEach((value, key) => headersObj.append(key, value));

  // récupérer la session avec Better Auth
  const session = await auth.api.getSession({ headers: headersObj });

  // non connecté → 401
  if (!session) {
    unauthorized();
  }

  // connecté mais mauvais rôle → 403
  if (session.user.role !== "EMPLOYEE") {
    forbidden();
  }

  // sérialiser les dates pour le client
  const safeSession = {
    ...session,
    session: {
      ...session.session,
      createdAt: session.session.createdAt.toISOString(),
      updatedAt: session.session.updatedAt.toISOString(),
      expiresAt: session.session.expiresAt.toISOString(),
    },
    user: {
      ...session.user,
      createdAt: session.user.createdAt.toISOString(),
      updatedAt: session.user.updatedAt.toISOString(),
    },
  };

  return <IntranetClient session={safeSession} />;
}
