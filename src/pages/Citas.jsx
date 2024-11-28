import React, { useState, useEffect } from "react";
import { auth, db } from "../components/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './Citas.css';

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [newCita, setNewCita] = useState({
    especialidad: "",
    medico: "",
    fechaHora: "",
    disponibilidad: "Disponible",
    descripcion: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCitas, setUserCitas] = useState([]);
  const navigate = useNavigate();
  const citasCollection = collection(db, "citas");

  // Obtener información del usuario autenticado
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay un usuario autenticado.");
        navigate("/");
        return;
      }

      // Obtener datos del usuario desde la colección `users`
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        console.error("No se encontró información del usuario.");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Obtener citas reservadas por el usuario
  useEffect(() => {
    const fetchCitasReservadas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("Usuario no autenticado.");
          return;
        }

        const q = query(citasCollection, where("usuarioId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userCitasArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserCitas(userCitasArray);
      } catch (error) {
        console.error("Error al cargar las citas reservadas:", error);
      }
    };

    fetchCitasReservadas();
  }, []);

// Cancelar una cita
const handleCancel = async (id) => {
  try {
    // Restablecer la cita como disponible
    const citaDoc = doc(db, "citas", id);
    await updateDoc(citaDoc, {
      disponibilidad: "Disponible",
      usuarioId: null, // Desvincular el usuario de la cita
    });

    // Eliminar la cita de las reservas del usuario
    setUserCitas(userCitas.filter((cita) => cita.id !== id));
    alert("Cita cancelada exitosamente.");
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    alert("Hubo un problema al cancelar la cita.");
  }
};


  // Crear o editar una cita
  const handleAddOrUpdate = async () => {
    if (userData?.role !== "admin") {
      alert("No tienes permisos para realizar esta acción.");
      return;
    }

    try {
      if (!newCita.especialidad || !newCita.medico || !newCita.fechaHora || !newCita.descripcion) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      if (editingId) {
        // Editar cita existente
        const citaDoc = doc(db, "citas", editingId);
        await updateDoc(citaDoc, newCita);
        setCitas(citas.map((cita) => (cita.id === editingId ? { id: editingId, ...newCita } : cita)));
        setEditingId(null);
      } else {
        // Crear nueva cita
        const docRef = await addDoc(citasCollection, {
          ...newCita,
          disponibilidad: "Disponible",
        });
        setCitas([...citas, { id: docRef.id, ...newCita }]);
      }

      setNewCita({
        especialidad: "",
        medico: "",
        fechaHora: "",
        disponibilidad: "Disponible",
        descripcion: "",
      });
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      alert("Hubo un error al guardar la cita.");
    }
  };

  // Eliminar una cita
  const handleDelete = async (id) => {
    if (userData?.role !== "admin") {
      alert("No tienes permisos para realizar esta acción.");
      return;
    }

    try {
      const citaDoc = doc(db, "citas", id);
      await deleteDoc(citaDoc);
      setCitas(citas.filter((cita) => cita.id !== id));
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Hubo un error al eliminar la cita.");
    }
  };

  if (!userData) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <h1 className="text-center">Gestión de Citas</h1>
      {userData.role === "admin" && (
        <div className="card p-4 mt-4">
          <h3>{editingId ? "Editar Cita" : "Nueva Cita"}</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Especialidad"
            value={newCita.especialidad}
            onChange={(e) =>
              setNewCita({ ...newCita, especialidad: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Médico"
            value={newCita.medico}
            onChange={(e) =>
              setNewCita({ ...newCita, medico: e.target.value })
            }
          />
          <input
            type="datetime-local"
            className="form-control"
            value={newCita.fechaHora}
            onChange={(e) =>
              setNewCita({ ...newCita, fechaHora: e.target.value })
            }
          />
          <textarea
            className="form-control"
            placeholder="Descripción"
            value={newCita.descripcion}
            onChange={(e) =>
              setNewCita({ ...newCita, descripcion: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={handleAddOrUpdate}>
            {editingId ? "Actualizar" : "Añadir"}
          </button>
        </div>
      )}
<div className="mt-4">
  <h3>Mis Citas Agendadas</h3>
  {userCitas.length > 0 ? (
    <ul>
      {userCitas.map((cita) => (
        <li key={cita.id}>
          <strong>Especialidad:</strong> {cita.especialidad}
          <br />
          <strong>Médico:</strong> {cita.medico}
          <br />
          <strong>Fecha y Hora:</strong> {cita.fechaHora}
          <br />
          <strong>Descripción:</strong> {cita.descripcion}
          <br />
          <button
            className="btn btn-danger"
            onClick={() => handleCancel(cita.id, cita.fechaHora)}
          >
            Cancelar Cita
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No tienes citas agendadas.</p>
  )}
</div>

    </div>
  );
};

export default Citas;
