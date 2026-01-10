import { CinemaType } from "./cinema";

export type RoomType = {
  id: number;
  numero: number;
  name: string;
  capacite: number;
  cinemaId: number;
  cinema?: CinemaType;
  availableSeat: number;
  qualityProjection: "FOUR_DX" | "THREE_D" | "FOUR_K" | "IMAX";
};
