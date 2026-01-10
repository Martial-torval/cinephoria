"use client";

import { fetchMovies } from "@/utils/api";
import { useState, useEffect } from "react";
import { MovieType } from "@/types/movie";
import MoviesSection from "@/components/backOffice/MoviesSection";
import RoomsSection from "@/components/backOffice/RoomsSection";
import EmployeesSection from "@/components/backOffice/EmployeesSection";
import ShowsSection from "@/components/backOffice/ShowsSection";
import AsideBackOffice from "@/components/backOffice/AsideBackOffice";

type SessionType = {
  session: {
    id: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  };
  user: {
    id: string;
    email: string;
    username: string;
    role: "ADMIN" | "EMPLOYEE" | "USER";
    createdAt: string;
    updatedAt: string;
  };
};

export default function AdminDashboardClient({
  session,
}: {
  session: SessionType;
}) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [activeSection, setActiveSection] = useState<
    "movies" | "rooms" | "employees" | "shows" | "reviews"
  >("movies");

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies();
      setMovies(data);
    };
    loadMovies();
  }, []);

  return (
    <>
      <div className="flex gap-8 mt-8">
        <AsideBackOffice
          activeSection={activeSection}
          onSelect={setActiveSection}
          role={session.user.role}
        />

        <section className="flex-1 flex flex-col gap-8">
          {activeSection === "movies" && (
            <MoviesSection movies={movies} reloadMovies={() => {}} />
          )}
          {activeSection === "rooms" && <RoomsSection />}
          {activeSection === "employees" && <EmployeesSection />}
          {activeSection === "shows" && <ShowsSection />}
        </section>
      </div>
    </>
  );
}
