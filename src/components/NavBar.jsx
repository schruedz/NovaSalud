import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import logo from "../assets/logo.png"; // Asegúrate de usar la ruta correcta para tu logo
import "./NavBar.css";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setAlertMessage("Cerraste sesión exitosamente");
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
        setAlertMessage("");
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Contenedor para el logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
        </li>
        {!isLoggedIn && (
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <>
            <li className="nav-item">
              <Link to="/citas" className="nav-link">
                Citas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reservar-cita" className="nav-link">
                Reservar Cita
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
      {alertVisible && <div className="alert-message">{alertMessage}</div>}
    </nav>
  );
};

export default NavBar;
