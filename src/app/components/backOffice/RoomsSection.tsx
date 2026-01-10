"use client";
import { useEffect, useState } from "react";
import CenteredModal from "@/components/Modal";
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  fetchCinema,
} from "@/utils/api";
import { QUALITY_OPTIONS } from "@/utils/enums";
import { RoomType } from "@/types/room";
import { CinemaType } from "@/types/cinema";
import { formatShowQuality } from "@/utils/format";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function RoomsSection() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    qualityProjection: "IMAX" as RoomType["qualityProjection"],
    cinemaId: 0,
  });

  // Charger salles
  const loadRooms = async () => {
    const data = await fetchRooms();
    setRooms(data);
  };

  // Charger cinémas
  const loadCinemas = async () => {
    const data = await fetchCinema();
    setCinemas(data);
    if (data.length > 0)
      setFormData((prev) => ({ ...prev, cinemaId: data[0].id }));
  };

  useEffect(() => {
    loadRooms();
    loadCinemas();
  }, []);

  // Formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom = await createRoom({
      name: formData.name,
      capacity: Number(formData.capacity),
      qualityProjection: formData.qualityProjection,
      cinemaId: Number(formData.cinemaId),
    });

    if (newRoom) {
      toast.success("✅ Salle ajoutée avec succès !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        capacity: 0,
        qualityProjection: "IMAX",
        cinemaId: cinemas[0]?.id ?? 0,
      });
      loadRooms();
    } else {
      toast.error("❌ Une erreur est survenue lors de l'ajout de la salle !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const updated = await updateRoom(selectedRoom.id, {
      capacite: Number(formData.capacity || selectedRoom.capacite),
      qualityProjection:
        formData.qualityProjection || selectedRoom.qualityProjection,
      cinemaId: Number(formData.cinemaId || selectedRoom.cinemaId),
    });

    if (updated) {
      toast.success("✅ Salle modifiée avec succès !", {
        style: {
          padding: "16px",
          maxWidth: "100%",
          borderRadius: "0px",
        },
      });
      setSelectedRoom(null);
      setFormData({
        name: "",
        capacity: 0,
        qualityProjection: "IMAX",
        cinemaId: cinemas[0]?.id ?? 0,
      });
      loadRooms();
    } else {
      toast.error(
        "❌ Une erreur est survenue lors de la modification de la salle !",
        {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        }
      );
    }
  };

  return (
    <article>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary text-white py-2 px-4   hover:bg-gray-400"
      >
        ➕ Ajouter une salle
      </button>

      {/* Tableau des salles */}
      <table className="w-full mt-4 border-collapse border border-secondary">
        <thead className={`text-3xl ${instrument_serif.className}`}>
          <tr>
            <th className="border p-2">Numéro de salle</th>
            <th className="border p-2">Cinéma</th>
            <th className="border p-2">Capacité</th>
            <th className="border p-2">Qualité projection</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const cinema = cinemas.find((c) => c.id === room.cinemaId);
            return (
              <tr key={room.id} className="text-center">
                <td className="border p-2">{room.numero}</td>
                <td className="border p-2 ">
                  {cinema && (
                    <>
                      <span>{cinema.name}</span>
                    </>
                  )}
                </td>

                <td className="border p-2">{room.capacite}</td>
                <td className="border p-2">
                  {formatShowQuality(room.qualityProjection)}
                </td>
                <td className="border p-2">
                  <button
                    className="bg-secondary border border-secondary text-white px-3 py-1 mr-3  hover:bg-yellow-600 hover:border-yellow-600"
                    onClick={() => {
                      setSelectedRoom(room);
                      setFormData({
                        name: room.name,
                        capacity: room.capacite,
                        qualityProjection: room.qualityProjection,
                        cinemaId: room.cinemaId,
                      });
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-primary border border-secondary text-secondary  ml-3 px-3 py-1  hover:bg-red-700 hover:border-red-700 hover:text-primary hover:-red-700 mt-2"
                    onClick={async () => {
                      if (
                        confirm(
                          `❌ Voulez-vous vraiment supprimer cette salle ?`
                        )
                      ) {
                        const success = await deleteRoom(room.id);
                        if (success) {
                          toast.success("✅ Salle supprimée avec succès !", {
                            style: {
                              padding: "16px",
                              maxWidth: "100%",
                              borderRadius: "0px",
                            },
                          });
                          loadRooms(); // recharge la liste
                        } else {
                          toast.error(
                            "❌ Une erreur est survenue lors de la suppression de la salle !",
                            {
                              style: {
                                padding: "16px",
                                maxWidth: "100%",
                                borderRadius: "0px",
                              },
                            }
                          );
                        }
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal Ajouter */}
      {isModalOpen && (
        <CenteredModal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Ajouter une salle</h2>
          <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
            <label className="flex flex-col">
              Capacité
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col">
              Qualité de projection
              <select
                name="qualityProjection"
                value={formData.qualityProjection}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {QUALITY_OPTIONS.map((q) => (
                  <option key={q} value={q}>
                    {formatShowQuality(q)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col">
              Cinéma
              <select
                name="cinemaId"
                value={formData.cinemaId}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              ✅ Ajouter
            </button>
          </form>
        </CenteredModal>
      )}

      {/* Modal Modifier */}
      {selectedRoom && (
        <CenteredModal onClose={() => setSelectedRoom(null)}>
          <h2 className="text-2xl font-bold mb-4">Modifier la salle</h2>
          <form onSubmit={handleUpdateRoom} className="flex flex-col gap-4">
            <label className="flex flex-col">
              Capacité
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col">
              Qualité de projection
              <select
                name="qualityProjection"
                value={formData.qualityProjection}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {QUALITY_OPTIONS.map((q) => (
                  <option key={q} value={q}>
                    {formatShowQuality(q)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col">
              Cinéma
              <select
                name="cinemaId"
                value={formData.cinemaId}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            >
              💾 Modifier
            </button>
          </form>
        </CenteredModal>
      )}
    </article>
  );
}
