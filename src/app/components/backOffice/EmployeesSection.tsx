"use client";
import { useState, useEffect } from "react";
import CenteredModal from "@/components/Modal";
import { deleteEmploye, readEmployees } from "@/utils/api";
import FormEmployee from "@/components/FormEmployee";
import { Instrument_Serif } from "next/font/google";
import toast from "react-hot-toast";
const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

type EmployeType = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  role: "EMPLOYEE" | "ADMIN" | "USER";
};

export default function EmployeeSection() {
  const [employes, setEmployes] = useState<EmployeType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState<EmployeType | null>(
    null
  );

  const loadEmployes = async () => {
    try {
      const data = await readEmployees();
      setEmployes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des employés :", error);
      setEmployes([]);
    }
  };

  useEffect(() => {
    loadEmployes();
  }, []);

  return (
    <article>
      {/* Bouton d'ajout */}
      <button
        onClick={() => {
          setSelectedEmploye(null);
          setIsModalOpen(true);
        }}
        className="bg-secondary text-white py-2 px-4   hover:bg-gray-400"
      >
        ➕ Ajouter un employé
      </button>

      {/* Tableau des employés */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className={`text-3xl ${instrument_serif.className}`}>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mot de passe</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp) => (
            <tr key={emp.id} className="text-center">
              <td className="border p-2 text-start">{emp.email}</td>
              <td className="border p-2">***********</td>
              <td className="border p-2">
                <button
                  className="bg-secondary border border-secondary text-white px-3 py-1 mr-3  hover:bg-yellow-600 hover:border-yellow-600"
                  onClick={() => {
                    setSelectedEmploye(emp);
                    setIsModalOpen(true);
                  }}
                >
                  Modifier
                </button>
                <button
                  className="bg-primary border border-secondary text-secondary  ml-3 px-3 py-1  hover:bg-red-700 hover:border-red-700 hover:text-primary hover:-red-700 mt-2"
                  onClick={async () => {
                    if (
                      confirm(
                        `❌ Voulez-vous vraiment supprimer "${emp.email}" ?`
                      )
                    ) {
                      const deleted = await deleteEmploye(emp.id);
                      if (deleted) {
                        toast.success("✅ Employé supprimé avec succès !", {
                          style: {
                            padding: "16px",
                            maxWidth: "100%",
                            borderRadius: "0px",
                          },
                        });
                        loadEmployes();
                      } else {
                        toast.error(
                          "❌ Une erreur est survenue lors de la suppression de l'employé !",
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
          ))}
        </tbody>
      </table>

      {/* Modal ajout / modification */}
      {isModalOpen && (
        <CenteredModal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">
            {selectedEmploye ? "Modifier" : "Ajouter"} un employé
          </h2>
          <FormEmployee
            employe={selectedEmploye || undefined}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              loadEmployes();
              setSelectedEmploye(null);
            }}
          />
        </CenteredModal>
      )}
    </article>
  );
}
