"use client";

import { useState, useEffect } from "react";
import MoviesSection from "@/components/backOffice/MoviesSection";
import RoomsSection from "@/components/backOffice/RoomsSection";
import ShowsSection from "@/components/backOffice/ShowsSection";
import ReviewsSection from "@/components/backOffice/ReviewsSection";
import AsideBackOffice from "@/components/backOffice/AsideBackOffice";
import { MovieType } from "@/types/movie";
import { ReviewType } from "@/types/review";
import { fetchMovies, fetchReviews } from "@/utils/api";

type SessionType = {
  session: {
    id: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  };
  user: {
    id: string;
    username: string;
    role: "EMPLOYEE" | "ADMIN" | "USER";
    createdAt: string;
    updatedAt: string;
  };
};

type SectionType = "movies" | "rooms" | "shows" | "reviews" | "employees";

export default function IntranetClient({ session }: { session: SessionType }) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [activeSection, setActiveSection] = useState<SectionType>("movies");

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies();
      setMovies(data);
    };
    const loadReviews = async () => {
      const data = await fetchReviews();
      setReviews(data);
    };
    loadMovies();
    loadReviews();
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
          {activeSection === "reviews" && (
            <ReviewsSection reviews={reviews} reloadReviews={() => {}} />
          )}
          {activeSection === "shows" && <ShowsSection />}
        </section>
      </div>
    </>
  );
}
