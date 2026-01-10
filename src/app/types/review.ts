export type ReviewType = {
  id: number;
  userId: string;
  user: { id: string; username: string };
  movieId: number;
  movie: { posterUrl: string; title: string };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  statut: "en_attente" | "valid" | "refus";
};
