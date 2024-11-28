import React, { useState } from "react";
import { auth } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css"; // Asegúrate de que el archivo CSS esté vinculado correctamente

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      navigate("/"); // Redirigir a la página principal después del inicio de sesión
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      alert(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/register"); // Redirigir a la página de registro
  };

  return (
    <div className="container-page">
      <div className="form">
        <h1>Iniciar Sesión</h1>
        <div className="input-container">
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary" onClick={handleSubmit}>
          Acceder
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleRegister}
        >
          Regístrate
        </button>
        <div className="error-message"></div>{" "}
        {/* Aquí puedes agregar mensajes de error si es necesario */}
      </div>
    </div>
  );
};

export default Login;
