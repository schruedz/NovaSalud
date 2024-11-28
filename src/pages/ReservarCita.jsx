import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth } from "../components/firebase";
import "./ReservarCita.css"; // Asegúrate de tener este archivo CSS

const ReservarCita = () => {
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [user, setUser] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citas = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((cita) => cita.disponibilidad === "Disponible"); // Filtrar solo citas disponibles
        setCitasDisponibles(citas);
      } catch (error) {
        console.error("Error al obtener citas disponibles:", error);
        alert("Hubo un problema al cargar las citas disponibles. Intenta más tarde.");
      }
    };

    const fetchUser = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.error("Usuario no autenticado.");
        alert("Debes iniciar sesión para reservar citas.");
      }
    };

    fetchCitas();
    fetchUser();
  }, []);

  const reservarCita = async (cita) => {
    if (!user) {
      alert("Debes estar autenticado para reservar una cita.");
      return;
    }

    try {
      await addDoc(collection(db, "reservas"), {
        citaId: cita.id,
        userId: user.uid,
        especialidad: cita.especialidad,
        medico: cita.medico,
        fechaHora: cita.fechaHora,
        estado: "Reservada",
        timestamp: serverTimestamp(),
      });

      const citaDoc = doc(db, "citas", cita.id);
      await updateDoc(citaDoc, {
        disponibilidad: "No disponible",
        usuarioId: user.uid,
      });

      alert("Cita reservada exitosamente.");
      setCitasDisponibles(citasDisponibles.filter((item) => item.id !== cita.id));
    } catch (error) {
      console.error("Error al reservar la cita:", error.message);
      alert("Ocurrió un error al reservar la cita.");
    }
  };

  // Filtrar citas según el término de búsqueda
  const citasFiltradas = citasDisponibles.filter((cita) =>
    `${cita.especialidad} ${cita.medico}`.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="citas-container">
      <h1>Reservar Cita</h1>
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar por especialidad o médico"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
      </div>
      {citasFiltradas.length === 0 ? (
        <p>No hay citas disponibles con los criterios de búsqueda.</p>
      ) : (
        <div className="citas-list">
          {citasFiltradas.map((cita) => (
            <div key={cita.id} className="cita-card">
              <p><strong>Especialidad:</strong> {cita.especialidad}</p>
              <p><strong>Médico:</strong> {cita.medico}</p>
              <p><strong>Fecha y Hora:</strong> {cita.fechaHora}</p>
              <button onClick={() => reservarCita(cita)}>Reservar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservarCita;
