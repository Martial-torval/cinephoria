import { unauthorized, forbidden } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AdminDashboardClient from "@/components/backOffice/AdminDashboardClient";

export default async function AdminPage() {
  // attendre headers() pour récupérer le ReadonlyHeaders
  const hdrs = await headers();

  // convertir en vrai Headers pour Better Auth
  const headersObj = new Headers();
  hdrs.forEach((value, key) => {
    headersObj.append(key, value);
  });

  // récupérer la session
  const session = await auth.api.getSession({ headers: headersObj });

  if (!session) {
    unauthorized(); // 401
  }

  if (session.user.role !== "ADMIN") {
    forbidden(); // 403
  }

  // Sérialiser les dates pour le client
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

  return <AdminDashboardClient session={safeSession} />;
}
