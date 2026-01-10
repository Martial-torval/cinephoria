"use client";
import { useState, useEffect } from "react";
import { createEmployee } from "@/utils/api";
import toast from "react-hot-toast";

type FormEmployeeProps = {
  onClose: () => void;
  onSuccess: () => void;
  employe?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    role: "EMPLOYEE" | "ADMIN" | "USER";
  };
};

export default function FormEmployee({
  onClose,
  onSuccess,
  employe,
}: FormEmployeeProps) {
  const [formData, setFormData] = useState({
    email: employe?.email || "",
    firstname: employe?.firstname || "",
    lastname: employe?.lastname || "",
    username: employe?.username || "",
    password: "",
  });

  useEffect(() => {
    if (employe) {
      setFormData({
        email: employe.email,
        firstname: employe.firstname,
        lastname: employe.lastname,
        username: employe.username,
        password: "",
      });
    } else {
      setFormData({
        email: "",
        firstname: "",
        lastname: "",
        username: "",
        password: "",
      });
    }
  }, [employe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (employe) {
        // PUT pour modification
        await fetch(`/api/users/${employe.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // POST via createEmployee
        await createEmployee({
          email: formData.email,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
          role: "EMPLOYEE",
        });
      }

      onSuccess();
      onClose();
      toast.success(
        "L'employé a été " +
          (employe ? "modifié" : "ajouté") +
          " avec succès !",
        {
          style: {
            padding: "16px",
            maxWidth: "100%",
            borderRadius: "0px",
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error(
        "Une erreur est survenue lors de la soumission du formulaire !",
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label>Prénom</label>
      <input
        type="text"
        value={formData.firstname}
        onChange={(e) =>
          setFormData({ ...formData, firstname: e.target.value })
        }
        required
      />
      <label>Nom</label>
      <input
        type="text"
        value={formData.lastname}
        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
        required
      />
      <label>Nom d&apos;utilisateur</label>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <label>Email</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <label>Mot de passe (laisser vide pour ne pas changer)</label>
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={!employe} // obligatoire uniquement à la création
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {employe ? "Modifier" : "Ajouter"}
      </button>
    </form>
  );
}
