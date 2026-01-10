"use client";

import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

type Props = {
  dates: string[]; // ex: ["2025-06-08", "2025-06-09", ...]
  selectedDate: string;
  onSelect: (date: string) => void;
};

const HorizontalDateSelector = ({ dates, selectedDate, onSelect }: Props) => {
  return (
    <div className="flex overflow-x-auto space-x-2 py-2 w-full lg:mb-20 md:mb-10 mb-20">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => onSelect(date)}
          className={`min-w-[90px] rounded-lg p-2 border text-center ${
            selectedDate === date ? "bg-secondary text-white" : "bg-primary"
          }`}
        >
          <div className="font-semibold">{dayjs(date).format("ddd")}</div>
          <div>{dayjs(date).format("D MMM")}</div>
        </button>
      ))}
    </div>
  );
};

export default HorizontalDateSelector;
