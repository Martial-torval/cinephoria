import { CinemaType } from "./cinema";
import ShowType from "./show";

export interface MovieType {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  createdAt: string;
  voteAverage: number;
  genre: string[];
  minimumAge?: number;
  isAdult: boolean;
  isFavorite: boolean;
  className?: string;
  rating?: number;
  rate: number;
  // key?: number;
  descriptionClassName?: string;
  qualityProjection?: string;
  cinemas?: CinemaType[];
  seances?: ShowType[];
}
