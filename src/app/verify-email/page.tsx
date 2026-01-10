"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("Vérification en cours...");

  const callbackURL = searchParams.get("callbackURL") || "/";

  useEffect(() => {
    if (
      token &&
      token.length > 0 &&
      token !== "null" &&
      token !== "undefined"
    ) {
      authClient
        .verifyEmail({
          query: { token, callbackURL },
        })

        .then(() => {
          setStatus(
            "Email vérifié ! Vous allez être redirigé vers la page de connexion."
          );
          setTimeout(() => {
            router.push(callbackURL);
          }, 4000);
        })

        .catch(() =>
          setStatus("Le lien de vérification est invalide ou expiré.")
        );
    }
  }, [token, callbackURL, router]);

  return (
    <div className="h-screen w-auto flex justify-center items-center p-4">
      <p className="text-2xl"> {status}</p>
    </div>
  );
}
