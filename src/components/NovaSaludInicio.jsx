import React from 'react';
import './NovaSaludInicio.css'; // Importa el archivo de estilo

const NovaSaludInicio = ({ isLoggedIn, userData }) => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary">Bienvenido a Nova Salud</h1>
      <p className="text-center text-muted mb-5">
        Tu bienestar, nuestra prioridad. Descubre servicios de salud diseñados para cuidarte a ti y a los tuyos.
      </p>

      {isLoggedIn ? (
        <>
          {userData ? (
            <div className="text-center mt-4">
              <h2 className="greeting-text">Hola, {userData.name} 👋</h2>
              <p className="role-text">Rol: {userData.role}</p>
              {userData.role === "admin" ? (
                <h3 className="text-success">Panel administrativo</h3>
              ) : (
                <p className="text-info">Explora nuestros servicios y reserva citas fácilmente.</p>
              )}
            </div>
          ) : (
            <p className="text-center">Cargando tus datos...</p>
          )}
        </>
      ) : (
        <div className="text-center mt-4">
          <p className="lead">¡Únete a Nova Salud para acceder a la mejor atención médica personalizada!</p>
          <p>
            Inicia sesión para reservar citas, explorar especialistas y mantenerte al día con tus servicios de salud.
          </p>
        </div>
      )}

      {/* Sección de servicios destacados */}
      <div className="row mt-5">
        <div className="col-md-4 text-center">
          <i className="fa-solid fa-stethoscope fa-3x text-primary service-icon"></i>
          <h4 className="mt-3">Consulta Médica</h4>
          <p>Accede a especialistas en diversas áreas para una atención rápida y eficiente.</p>
        </div>
        <div className="col-md-4 text-center">
          <i className="fa-solid fa-heart fa-3x text-danger service-icon"></i>
          <h4 className="mt-3">Chequeos Preventivos</h4>
          <p>Programas diseñados para monitorear tu salud y prevenir enfermedades.</p>
        </div>
        <div className="col-md-4 text-center">
          <i className="fa-solid fa-user-doctor fa-3x text-success service-icon"></i>
          <h4 className="mt-3">Asesoramiento Médico</h4>
          <p>Obtén orientación profesional para mantener un estilo de vida saludable.</p>
        </div>
      </div>
    </div>
  );
};

export default NovaSaludInicio;
