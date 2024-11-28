import React from "react";
import "./Footer.css"; // Archivo de estilos CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Centro Médico Nova Salud | Todos los derechos reservados</p>
        <div className="footer-links">
          <a href="/about">Sobre Nosotros</a>
          <a href="/contact">Contáctanos</a>
          <a href="/privacy">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
