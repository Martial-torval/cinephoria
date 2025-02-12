export interface MovieType {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropPath: string;
  createdAt: string;
  voteAverage: number;
  genre_list: string;
  minimumAge?: number;
  releaseDate?: string;
  isAdult: boolean;
  className?: string;
  key?: number;
  descriptionClassName?: string;
}
