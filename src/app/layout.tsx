import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cinephoria",
  description: "Cinephoria est un cinéma indépendant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-primary ">
        <Header />
        <main
          className="flex-1 p-5 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed
"
        >
          {children}
        </main>
        <Footer />

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
