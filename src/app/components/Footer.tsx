"use client";
import { authClient } from "@/lib/auth-client";
import { CinemaType } from "@/types/cinema";
import { fetchCinema } from "@/utils/api";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const instrument_sans = Instrument_Sans({ weight: "400", subsets: ["latin"] });
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function FooterClient() {
  const router = useRouter();

  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const { data: session, refetch } = authClient.useSession();
  useEffect(() => {
    const loadCinemas = async () => {
      const data = await fetchCinema(); // ou ton endpoint
      setCinemas(data);
    };
    loadCinemas();
  }, []);
  const user = session?.user;
  const handleSignOut = async () => {
    await authClient.signOut();
    refetch(); // Met à jour la session après la déconnexion
    router.push("/connexion");
  };

  return (
    <footer className="grid lg:grid-cols-8 md:grid-cols-3 grid-row-2 gap-y-10  bg-secondary text-primary p-6 mt-auto  lg:text-sm md:text-base text-base">
      <h2
        className={`${instrument_serif.className} lg:text-6xl  row-span-1 md:text-5xl text-4xl  md:col-span-full  lg:mb-0 md:mb-10`}
      >
        Cinephoria
      </h2>
      {cinemas.map((cinema) => (
        <div key={cinema.id} className="h-full w-auto flex flex-col gap-2">
          <h3
            className={`${instrument_serif.className} text-2xl lg:text-3xl mb-1`}
          >
            {cinema.city}
          </h3>
          <p className="text-sm">{cinema.address}</p>
          {/* {cinema.phone && <p className="text-sm">{cinema.phone}</p>} */}
          <p className="text-sm">01.02.03.04.05</p>
          <p className="text-sm"> Lun - Ven 10h - 22h</p>
          <p className="text-sm"> Sam - Dim 10h - 20h</p>
        </div>
      ))}
      <div className="h-full w-auto flex flex-col">
        <nav className="h-full flex flex-col">
          <h3
            className={`${instrument_serif.className} md:mt-0 mt-0 lg:text-3xl md:text-2xl text-2xl mb-3`}
          >
            Navigation
          </h3>
          <ul className="flex flex-col gap-1 flex-1">
            <li>
              <Link href="/films" className={instrument_sans.className}>
                Films
              </Link>
            </li>
            <li>
              <Link href="/reservations" className={instrument_sans.className}>
                Réservations
              </Link>
            </li>
            <li>
              <Link href="/contact" className={instrument_sans.className}>
                Contact
              </Link>
            </li>
            {user ? (
              <>
                {user.role === "USER" && (
                  <li>
                    <Link href={"/mon-espace"}>Mon espace</Link>
                  </li>
                )}
                {user.role === "ADMIN" && (
                  <li>
                    <Link href={"/admin"}>Administration</Link>
                  </li>
                )}
                {user.role === "EMPLOYEE" && (
                  <li>
                    <Link href={"/intranet"}>Intranet</Link>
                  </li>
                )}
                <li className="mt-auto">
                  <button
                    onClick={handleSignOut}
                    className="text-start underline"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              // Utilisateur non connecté
              <>
                <li>
                  <Link href={"/inscription"}>Inscription</Link>
                </li>
                <li>
                  <Link href={"/connexion"}>Connexion</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
