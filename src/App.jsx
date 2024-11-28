import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import NavBar from "./components/NavBar";
import Citas from "./pages/Citas";
import ReservarCita from "./pages/ReservarCita";
import Footer from "./components/Footer";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Inicio />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/reservar-cita" element={<ReservarCita />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
