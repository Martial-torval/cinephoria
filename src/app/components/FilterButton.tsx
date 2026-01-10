"use client";
import { CinemaType } from "../types/cinema";
import { GENRE_OPTIONS } from "../utils/enums";

interface FilterButtonProps {
  cinemas: CinemaType[];
  onCinemaChange: (id: number | null) => void;
  onGenreChange: (genre: string | null) => void;
  onDayChange: (day: string | null) => void;
}

export default function FilterButton({
  cinemas,
  onCinemaChange,
  onGenreChange,
  onDayChange,
}: FilterButtonProps) {
  return (
    <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-0 mt-5">
      {/* Filtre Cinéma */}
      <div className="flex flex-col gap-2">
        <label htmlFor="cinema">Cinéma</label>
        <select
          className="border border-secondary text-lg rounded-none p-1"
          onChange={(e) => onCinemaChange(Number(e.target.value) || null)}
        >
          <option value="">Tous les cinémas</option>
          {cinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre Genre */}
      <div className="flex flex-col gap-2">
        <label htmlFor="genre">Genre</label>
        <select
          className="border border-secondary text-lg rounded-none p-1"
          onChange={(e) => onGenreChange(e.target.value || null)}
        >
          <option value="" className="">
            Tous les genres
          </option>
          {GENRE_OPTIONS.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre Jour */}
      <div className="flex flex-col gap-2">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          className="border border-secondary text-lg rounded-none py-0.5 px-2"
          onChange={(e) => onDayChange(e.target.value || null)}
        />
      </div>
    </div>
  );
}
