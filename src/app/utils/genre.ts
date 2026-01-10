export const GenreEnum = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentaire",
  "Drame",
  "Famille",
  "Fantasie",
  "Historique",
  "Horreur",
  "Musique",
  "Mystère",
  "Romance",
  "ScienceFiction",
  "Thriller",
  "Guerre",
  "Western",
] as const;

export type GenreType = (typeof GenreEnum)[number];
