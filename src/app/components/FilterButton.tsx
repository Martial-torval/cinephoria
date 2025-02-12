"use client";
import { useState, useEffect } from "react";
import { CinemaType } from "../types/cinema";
import { fetchCinema } from "../utils/api";

export default function FilterButton() {
  const [cinema, setCinema] = useState<CinemaType[]>([]);

  useEffect(() => {
    const loadCinema = async () => {
      const cinemaData = await fetchCinema();
      setCinema(cinemaData);
    };
    loadCinema();
  });
  return (
    <div className="w-full flex gap-4">
      <div className="flex flex-col">
        <label htmlFor="cinema">Cinema</label>
        <select className="border border-black">
          {cinema.map((cinema) => (
            <option key={cinema.id} value={cinema.name}>
              {cinema.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="quality">Qualité</label>
        <select className="border border-black">
          <option value="3D">3D</option>
          <option value="4DX">4DX</option>
          <option value="IMAX">IMAX</option>
          <option value="IMAX3D">IMAX3D</option>
        </select>
      </div>
    </div>
  );
}
