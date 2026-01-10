import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});
export default function Forbidden() {
  return (
    <div>
      <h2
        className={`${instrument_serif.className} lg:text-6xl md:text-5xl text-4xl`}
      >
        403 - Interdit
      </h2>
      <p>Vous n&apos;êtes pas autorisé à accéder à cette page</p>
      <Link href="/">Retourner à l&apos;accueil</Link>
    </div>
  );
}
