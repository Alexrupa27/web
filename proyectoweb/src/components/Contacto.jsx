import React from 'react';
import "../styles/components/Contacto.css";

const Contacto = () => {
  return (
    <div className="contacto-container">
      <h1 className="contacto-title">Contáctanos</h1>
      <div className="contacto-card">
        <h2 className="contacto-card-title">Información de la Empresa</h2>
        <p><strong>Nombre:</strong> Plagatronic S.A.</p>
        <p><strong>Dirección:</strong> Calle Falsa 123, Ciudad, País</p>
        <p><strong>Correo Electrónico:</strong> contacto@miempresa.com</p>
        <p><strong>Teléfono:</strong> +34 123 456 789</p>
        <p><strong>Horario de Atención:</strong> Lunes a Viernes de 9:00 a 18:00</p>
      </div>
    </div>
  );
};

export default Contacto;

