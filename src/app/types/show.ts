import { RoomType } from "./room";

export default interface ShowType {
  id: number;
  startTime: string;
  endTime: string;
  qualityProjection: string;
  capacity: number;
  number: number;
  reservedSeats: number[];
  pmrSeats: number[];
  availableSeat: number;
  room: RoomType;
  roomId: number;
  movie: { id: number; title: string; posterUrl: string };
  cinema: { id: number; name: string; image: string };
  basePrice: number; // ← obligatoire
  cinemaId: number;
}
