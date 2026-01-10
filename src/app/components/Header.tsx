"use client";

import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import Hamburger from "hamburger-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

const menuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.25 },
  },
};

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  const tabletDevice = useMediaQuery("(max-width: 992px)");
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    refetch();
    setOpen(false);
    router.push("/connexion");
  };

  const closeMenu = () => setOpen(false);

  const mobileLinkClass = `${instrument_serif.className} text-4xl`;

  return (
    <header className="flex justify-between items-center text-secondary m-6 relative z-50">
      {/* Logo */}
      <Link href="/">
        <h1
          className={`${instrument_serif.className} lg:text-7xl md:text-6xl text-5xl`}
        >
          Cinephoria
        </h1>
      </Link>

      {/* Desktop */}
      {!tabletDevice ? (
        <nav className="lg:text-4xl text-3xl">
          <ul className={`${instrument_serif.className} flex gap-10`}>
            <Link href="/films">Films</Link>
            <Link href="/reservation">Réservations</Link>
            <Link href="/contact">Contact</Link>

            {user ? (
              <>
                {user.role === "USER" && (
                  <Link href="/mon-espace">Mon espace</Link>
                )}
                {user.role === "ADMIN" && (
                  <Link href="/admin">Administration</Link>
                )}
                {user.role === "EMPLOYEE" && (
                  <Link href="/intranet">Intranet</Link>
                )}
                <button onClick={handleSignOut}>Se déconnecter</button>
              </>
            ) : (
              <>
                <Link href="/inscription">Inscription</Link>
                <Link href="/connexion">Connexion</Link>
              </>
            )}
          </ul>
        </nav>
      ) : (
        <>
          {/* Hamburger / Croix */}
          <div className="z-50">
            <Hamburger toggled={isOpen} toggle={setOpen} size={28} />
          </div>

          {/* Menu mobile */}
          <AnimatePresence>
            {isOpen && (
              <motion.aside
                className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-40"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Liens centrés */}
                <nav className="flex flex-col items-center justify-center gap-10 h-full">
                  <Link
                    href="/films"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Films
                  </Link>
                  <Link
                    href="/reservation"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Réservations
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Contact
                  </Link>

                  {user ? (
                    <>
                      {user.role === "USER" && (
                        <Link
                          href="/mon-espace"
                          onClick={closeMenu}
                          className={mobileLinkClass}
                        >
                          Mon espace
                        </Link>
                      )}
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={closeMenu}
                          className={mobileLinkClass}
                        >
                          Administration
                        </Link>
                      )}
                      {user.role === "EMPLOYEE" && (
                        <Link
                          href="/intranet"
                          onClick={closeMenu}
                          className={mobileLinkClass}
                        >
                          Intranet
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className={mobileLinkClass}
                      >
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/inscription"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Inscription
                      </Link>
                      <Link
                        href="/connexion"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Connexion
                      </Link>
                    </>
                  )}
                </nav>
              </motion.aside>
            )}
          </AnimatePresence>
        </>
      )}
    </header>
  );
}
