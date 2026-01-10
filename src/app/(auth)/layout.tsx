import { ReactNode } from "react";
import Image from "next/image";
import AuthImg from "@/public/LoginImage.jpg";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[75vh] overflow-hidden">
      {/* Image à gauche */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src={AuthImg}
          alt="Illustration Auth"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Formulaire / contenu à droite */}
      <div className="flex w-full lg:w-1/2 items-center justify-center">
        <div className="w-full max-w-md flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
