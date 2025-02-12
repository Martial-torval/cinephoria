// MOVIES
export const fetchMovies = async () => {
  try {
    const res = await fetch("/api/movies");
    if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des films :", error);
    return [];
  }
};

// CINEMA

export const fetchCinema = async () => {
  try {
    const res = await fetch("/api/cinema");
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
