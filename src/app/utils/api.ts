const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { MovieType } from "@/types/movie";

export async function fetchMovies(): Promise<MovieType[]> {
  try {
    const res = await fetch("/api/movies");
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);

    const data = (await res.json()) as MovieType[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Erreur lors du chargement des films :", error);
    return [];
  }
}

export type Employee = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: "ADMIN" | "EMPLOYEE" | "USER";
  firstname: string;
  lastname: string;
  username: string;
};

export async function readEmployees(): Promise<Employee[]> {
  try {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // pour inclure les cookies de session si nécessaire
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch employees: ${res.statusText}`);
    }

    const data: { employees: Employee[] } = await res.json();
    return data.employees || [];
  } catch (error) {
    console.error("readEmployees error:", error);
    return [];
  }
}
export async function createEmployee(data: {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  role: "USER" | "EMPLOYEE" | "ADMIN";
}) {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erreur lors de la création de l'employé");

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateEmploye(
  id: string,
  data: {
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    role: "EMPLOYE" | "ADMIN" | "USER";
    password?: string; // si tu veux changer le mot de passe
  }
) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // ✅ inclut le cookie de session
    });

    if (!res.ok) {
      throw new Error(`Erreur API ${res.status} : ${res.statusText}`);
    }

    const updated = await res.json();
    return updated;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour d'un employé :", error);
    return null;
  }
}

export const deleteEmploye = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${baseUrl}/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("❌ Erreur API suppression employé:", err);
      return false;
    }

    const data = await res.json();
    console.log("✅ Employé supprimé:", data);
    return true;
  } catch (error) {
    console.error("❌ Erreur réseau suppression employé:", error);
    return false;
  }
};

interface CreateMovieInput {
  title: string;
  description: string;
  minimumAge: string;
  posterUrl?: string;
  genre?: string[]; // <- accepter un tableau de strings
}

export async function createMovie(
  data: CreateMovieInput
): Promise<MovieType | null> {
  try {
    const res = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // genre sera un tableau
    });

    if (!res.ok) throw new Error("Erreur création film");

    return res.json();
  } catch (err) {
    console.error("❌ Erreur Prisma POST movie :", err);
    return null;
  }
}
export const updateMovie = async (
  movieId: number,
  data: {
    title: string;
    description: string;
    posterUrl?: string;
    genre: string[];
    minimumAge?: number;
  }
) => {
  try {
    const res = await fetch(`/api/movies/${movieId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur mise à jour");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const deleteMovie = async (movieId: number) => {
  try {
    const res = await fetch(`/api/movies/${movieId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur suppression");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// CINEMA

export const fetchCinema = async () => {
  try {
    const res = await fetch("/api/cinemas");
    if (!res.ok)
      throw new Error(
        "Erreur lors de la récupération des cinémas : " +
          res.status +
          " " +
          res.statusText
      );
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

export const fetchCinemaById = async (id_cinema: number) => {
  try {
    const res = await fetch(`${baseUrl}/api/cinemas/${id_cinema}`);
    if (!res.ok)
      throw new Error(
        `Erreur lors de la récupération du cinéma avec l'id = ${id_cinema} : ` +
          res.status +
          " " +
          res.statusText
      );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const readAllMoviesWithShows = async (cinemaId?: string) => {
  try {
    const url = cinemaId
      ? `${baseUrl}/api/movies/with-shows?cinemaId=${cinemaId}`
      : `${baseUrl}/api/movies/with-shows`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);

    return await res.json();
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des films :", error);
    return { results: [] };
  }
};
export const fetchMovieByCinemaId = async (id_cinema: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/cinemas/${id_cinema}/movies`);
    if (!res.ok)
      throw new Error(
        `Erreur lors de la récupération des films du cinéma avec l'id = ${id_cinema} : ` +
          res.status +
          " " +
          res.statusText
      );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const fetchShowByMovieAndCinema = async (
  id_cinema: number,
  id_movie: number
) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(
      `${baseUrl}/api/cinemas/${id_cinema}/movies/${id_movie}/shows`
    );
    if (!res.ok) {
      throw new Error(
        `Erreur lors de la récupération des séances avec comme id cinema = ${id_cinema}  et ID movie = ${id_movie}. ` +
          " " +
          res.statusText
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchMovieById = async (id_movie: number) => {
  try {
    const res = await fetch(`${baseUrl}/api/movies/${id_movie}`);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const fetchShowById = async (id_show: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/shows/${id_show}`);
    if (!res.ok) {
      throw new Error(
        `Erreur lors de la récupération des séances avec comme id = ${id_show}` +
          " " +
          res.statusText
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
// CREATE a new BOOKING
export const createBooking = async (bookingData: {
  userId: string;
  seanceId: number;
  numberOfSeats: number;
  bookingSeats: number[];
  totalPrice: number;
}) => {
  try {
    const res = await fetch(`${baseUrl}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la création de la réservation :", error);
    return null;
  }
};

export const readBookingByUserId = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/reservations`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des réservations :",
      error
    );
    return [];
  }
};
// SHOWS
export const readAllShows = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/shows`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des séances :", error);
    return [];
  }
};

export const createShow = async (showData: {
  movieId: number;
  cinemaId?: number;
  roomId: number;
  startTime: Date;
  endTime: Date;
  qualityProjection: string;
}) => {
  try {
    const res = await fetch("/api/shows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(showData),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la création de la séance :", error);
    return null;
  }
};

export const updateShow = async (
  id: number,
  showData: {
    movieId: number;
    cinemaId?: number;
    roomId: number;
    startTime: Date;
    endTime: Date;
    qualityProjection: string;
  }
) => {
  try {
    const res = await fetch(`${baseUrl}/api/shows/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(showData),
    });

    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la création de la salle :", error);
    return null;
  }
};

export const deleteShow = async (id: number) => {
  try {
    const res = await fetch(`${baseUrl}/api/shows/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la séance :", error);
    return false;
  }
};

// ROOMS
export const fetchRooms = async () => {
  try {
    const res = await fetch("/api/room");
    if (!res.ok)
      throw new Error(
        "Erreur lors de la récupération des salles : " +
          res.status +
          " " +
          res.statusText
      );
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const createRoom = async (roomData: {
  name: string;
  capacity: number;
  cinemaId: number;
  qualityProjection: "FOUR_DX" | "THREE_D" | "FOUR_K" | "IMAX";
}) => {
  try {
    const res = await fetch("/api/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la création de la salle :", error);
    return null;
  }
};
export const updateRoom = async (
  id: number,
  roomData: {
    capacite: number;
    qualityProjection: "IMAX" | "FOUR_DX" | "THREE_D" | "FOUR_K";
    cinemaId: number;
  }
) => {
  try {
    const res = await fetch(`/api/room/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });

    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);

    return await res.json();
  } catch (error) {
    console.error("❌ Erreur lors de la modification de la salle :", error);
    return null;
  }
};

export const deleteRoom = async (id: number) => {
  try {
    const res = await fetch(`/api/room/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la salle :", error);
    return false;
  }
};

export interface CreateReviewInput {
  movieId: number;
  rate: number;
  comment: string;
}

export async function createReview(data: CreateReviewInput) {
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId: data.movieId,
        rate: data.rate,
        comment: data.comment,
        statut: "en_attente", // ✅ par défaut soumis pour validation
      }),
    });

    if (!res.ok) throw new Error("Erreur lors de la création de l'avis");

    const review = await res.json();
    return review;
  } catch (err) {
    console.error("❌ Erreur createReview:", err);
    return null;
  }
}

export async function fetchReviews() {
  try {
    const res = await fetch("/api/reviews");
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch (error) {
    console.error("❌ Erreur lors du chargement des avis :", error);
    return [];
  }
}

export async function readReviewsByMovieId(id_movie: number) {
  try {
    const res = await fetch(`/api/reviews/movie/${id_movie}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ✅ pour forcer le rechargement des données
    });

    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des avis");
    }

    const reviews = await res.json();
    return reviews;
  } catch (err) {
    console.error("❌ Erreur readReviewsByMovieId :", err);
    return [];
  }
}

export async function validateReview(id_review: number) {
  const res = await fetch(`/api/reviews/${id_review}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statut: "valid" }),
  });
  return res.ok;
}

export async function refuseReview(id_review: number) {
  const res = await fetch(`/api/reviews/${id_review}`, {
    method: "DELETE",
  });
  return res.ok;
}
export async function sendContactMessage(data: {
  username?: string;
  title: string;
  description: string;
}) {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Erreur lors de l'envoi du message");
    }

    return await res.json();
  } catch (err) {
    console.error("Erreur sendContactMessage:", err);
    throw err;
  }
}
