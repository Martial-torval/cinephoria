"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import HorizontalDateSelector from "./HorizontalDateSelector";
import CardShow from "@/components/CardShow";
import {
  formatDateToFrenchHour,
  formatShowQuality,
  getPriceByQuality,
} from "@/utils/format";

dayjs.locale("fr");

type ShowType = {
  id: number;
  startTime: string;
  endTime: string;
  qualityProjection: string;
  capacity: number;
  room: {
    numero: number;
    capacity: number;
    availableSeat: number;
    cinemaId?: number;
    cinema?: { id: number; name: string; image?: string };
  };
};

type Props = {
  shows: ShowType[];
  cinemaId: number;
  movieId: number;
};

const ShowCalendar = ({ shows, cinemaId, movieId }: Props) => {
  const allDates = useMemo(() => {
    const dates = Array.from(
      new Set(shows.map((s) => dayjs(s.startTime).format("YYYY-MM-DD")))
    ).sort();
    return dates;
  }, [shows]);

  const [selectedDate, setSelectedDate] = useState<string>(allDates[0] ?? "");

  const filteredShows = useMemo(
    () =>
      shows.filter(
        (s) => dayjs(s.startTime).format("YYYY-MM-DD") === selectedDate
      ),
    [shows, selectedDate]
  );

  return (
    <div className="lg:space-y-4 md:space-y-2 space-y-4">
      {allDates.length > 0 && (
        <HorizontalDateSelector
          dates={allDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      )}

      <div className="flex flex-wrap gap-4">
        {filteredShows.length > 0 ? (
          filteredShows.map((show) => (
            <CardShow
              key={show.id}
              id={show.id}
              startTime={formatDateToFrenchHour(show.startTime)}
              endTime={formatDateToFrenchHour(show.endTime)}
              quality={formatShowQuality(show.qualityProjection)}
              capacity={show.capacity}
              room={{
                number: show.room.numero,
                availableSeat: show.room.availableSeat,
              }}
              price={getPriceByQuality(show.qualityProjection)}
              link={`/reservation/cinema/${
                show.room?.cinema?.id ?? show.room?.cinemaId ?? cinemaId
              }/film/${movieId}/seance/${show.id}`}
            />
          ))
        ) : (
          <p className="text-center text-muted w-full">
            Aucune séance ce jour-là.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShowCalendar;
