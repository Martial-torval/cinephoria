"use client";
import { useEffect, useState } from "react";
import CenteredModal from "@/components/Modal";
import {
  createShow,
  readAllShows,
  updateShow,
  deleteShow,
  fetchMovies,
  fetchCinema,
  fetchRooms,
} from "@/utils/api";
import { MovieType } from "@/types/movie";
import { CinemaType } from "@/types/cinema";
import { RoomType } from "@/types/room";
import ShowType from "@/types/show";
import { formatShowQuality } from "@/utils/format";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function ShowsSection() {
  const [shows, setShows] = useState<ShowType[]>([]);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<ShowType | null>(null);

  const [formData, setFormData] = useState({
    movieId: 0,
    roomId: 0,
    startTime: "",
    endTime: "",
  });

  // --- Charger les données ---
  const loadShows = async () => setShows(await readAllShows());
  const loadMovies = async () => {
    const data = await fetchMovies();
    setMovies(data);
    if (data.length > 0)
      setFormData((prev) => ({ ...prev, movieId: data[0].id }));
  };
  const loadCinemas = async () => {
    const data = await fetchCinema();
    setCinemas(data);
  };
  const loadRooms = async () => {
    const data = await fetchRooms();
    setRooms(data);
    if (data.length > 0)
      setFormData((prev) => ({ ...prev, roomId: data[0].id }));
  };

  useEffect(() => {
    loadShows();
    loadMovies();
    loadCinemas();
    loadRooms();
  }, []);

  // --- Formulaire ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRoom = rooms.find((r) => r.id === Number(formData.roomId));
    if (!selectedRoom) return;

    const newShow = await createShow({
      movieId: Number(formData.movieId),
      roomId: Number(formData.roomId),
      cinemaId: selectedRoom.cinemaId, // 🔹 important
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      qualityProjection: selectedRoom.qualityProjection,
    });

    if (newShow) {
      toast.success("✅ Séance ajoutée avec succès !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
      setIsModalOpen(false);
      loadShows();
    }
  };

  const handleUpdateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;

    const selectedRoom = rooms.find((r) => r.id === Number(formData.roomId));
    if (!selectedRoom) return;

    const updated = await updateShow(selectedShow.id, {
      movieId: Number(formData.movieId),
      roomId: Number(formData.roomId),
      cinemaId: selectedRoom.cinemaId,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      qualityProjection: selectedRoom.qualityProjection,
    });

    if (updated) {
      toast.success("✅ Séance modifiée avec succès !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
      setSelectedShow(null);
      setIsModalOpen(false);
      loadShows();
    }
  };

  const handleDeleteShow = async (id: number) => {
    if (confirm("❌ Supprimer cette séance ?")) {
      const success = await deleteShow(id);
      if (success) {
        toast.success("✅ Séance supprimée avec succès !", {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        });
        loadShows();
      }
    }
  };

  return (
    <article>
      <button
        onClick={() => {
          setSelectedShow(null);
          setFormData({
            movieId: movies[0]?.id ?? 0,
            roomId: rooms[0]?.id ?? 0,
            startTime: "",
            endTime: "",
          });
          setIsModalOpen(true);
        }}
        className="bg-secondary text-white py-2 px-4   hover:bg-gray-400"
      >
        ➕ Ajouter une séance
      </button>

      {/* Tableau des séances */}
      <table className="w-full mt-4 border-collapse border border-secondary">
        <thead className={`text-3xl ${instrument_serif.className}`}>
          <tr>
            <th className="border p-2">Film</th>
            <th className="border p-2">Cinéma</th>
            <th className="border p-2">Salle</th>
            <th className="border p-2">Qualité</th>
            <th className="border p-2">Début</th>
            <th className="border p-2">Fin</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => {
            const movie = movies.find((m) => m.id === show.movie.id);
            const room = rooms.find((r) => r.id === show.room.id);
            const cinema = cinemas.find((c) => c.id === room?.cinemaId);

            return (
              <tr key={show.id} className="text-center">
                <td className="border font-bold">{movie?.title ?? "—"}</td>
                <td className="border">{cinema?.name ?? "—"}</td>
                <td className="border">{room?.numero ?? "—"}</td>
                <td className="border">
                  {formatShowQuality(show.qualityProjection)}
                </td>
                <td className="border">
                  {new Date(show.startTime).toLocaleString()}
                </td>
                <td className="border">
                  {new Date(show.endTime).toLocaleString()}
                </td>
                <td className="border  p-2">
                  <button
                    className="bg-secondary border border-secondary text-white px-3 py-1 mr-3  hover:bg-yellow-600 hover:border-yellow-600"
                    onClick={() => {
                      setSelectedShow(show);
                      setFormData({
                        movieId: show.movie.id,
                        roomId: show.room.id,
                        startTime: new Date(show.startTime)
                          .toISOString()
                          .slice(0, 16),
                        endTime: new Date(show.endTime)
                          .toISOString()
                          .slice(0, 16),
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-primary border border-secondary text-secondary  ml-3 px-3 py-1  hover:bg-red-700 hover:border-red-700 hover:text-primary hover:-red-700 mt-2"
                    onClick={() => handleDeleteShow(show.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <CenteredModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedShow(null);
          }}
        >
          <form
            onSubmit={selectedShow ? handleUpdateShow : handleAddShow}
            className="flex flex-col gap-4"
          >
            {/* Film */}
            <label className="flex flex-col">
              Film projeté
              <select
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </label>

            {/* Salle */}
            <label className="flex flex-col">
              Salle
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Salle {r.numero} (capacité {r.capacite})
                  </option>
                ))}
              </select>
            </label>

            {/* Affichage automatique du cinéma */}
            <div>
              Cinéma :{" "}
              <strong>
                {cinemas.find(
                  (c) =>
                    c.id ===
                    rooms.find((r) => r.id === Number(formData.roomId))
                      ?.cinemaId
                )?.name ?? "—"}
              </strong>
            </div>

            {/* Début */}
            <label className="flex flex-col">
              Début de la séance
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="border rounded px-2 py-1"
              />
            </label>

            {/* Fin */}
            <label className="flex flex-col">
              Fin de la séance
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="border rounded px-2 py-1"
              />
            </label>

            <button
              type="submit"
              className={`py-2 px-4 rounded text-white ${
                selectedShow
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {selectedShow ? "✏️ Modifier" : "✅ Ajouter"}
            </button>
          </form>
        </CenteredModal>
      )}
    </article>
  );
}
