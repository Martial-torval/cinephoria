import { PrismaClient, Prisma } from "@prisma/client";
import { Genre } from "./types/genre";

const prisma = new PrismaClient();

async function fetchMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMBD_API_KEY}&language=fr-FR`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN_AUTH}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Échec de la récupération des films: " + response.status);
  }

  const data = await response.json();
  return data.results.slice(0, 50);
}

// GET
async function fetchGenresByIds(genreIds: number[]) {
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMBD_API_KEY}&language=fr-FR`
  );
  if (!response.ok)
    throw new Error("Erreur durant la récupération des genres (id)");

  const data = await response.json();

  // Vérification que 'data.genres' est bien un tableau
  if (!data.genres || !Array.isArray(data.genres)) {
    throw new Error("Genres non trouvés dans la réponse de l'API");
  }

  // Filtrer les genres par IDs
  const filteredGenres = data.genres.filter((genre: Genre) =>
    genreIds.includes(genre.id)
  );

  return filteredGenres.map((genre: Genre) => genre.name); // Retourner les noms des genres
}

async function main() {
  try {
    const movies = await fetchMovies(); // Contient une liste de films TMDb
    console.log(`Movies fetched successfully: ${movies.length} films`);

    // Récupérer tous les genre_ids des films dans un tableau
    const allGenreIds = movies
      .flatMap((movie: any) => movie.genre_ids) // Extraire genre_ids de chaque film
      .filter((value, index, self) => self.indexOf(value) === index); // Supprimer les doublons

    // Récupérer les noms des genres en fonction des genre_ids
    const genres = await fetchGenresByIds(allGenreIds);

    // Utiliser for...of pour gérer les appels asynchrones pour chaque film
    for (const movie of movies) {
      try {
        const movieData: Prisma.MovieCreateInput = {
          title: movie.title,
          description: movie.overview || "",
          minimumAge: movie.adult ? 18 : 0,
          posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
          isFavorite: false,
          createdAt: new Date(),
          backdropPath: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          genre: genres.join(", "), // Utilisation des genres récupérés
        };

        // Insertion dans la base de données
        const createMovie = await prisma.movie.create({
          data: movieData,
        });

        console.log("Film créé : ", createMovie);
      } catch (error) {
        console.error("Erreur lors de la création du film : ", error);
      }
    }
  } catch (error) {
    console.error("Erreur principale : ", error);
  } finally {
    // Déconnexion propre de Prisma après la fin de la boucle
    await prisma.$disconnect();
  }
}

main();
