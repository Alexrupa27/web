// Bienvenido.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Bienvenido.css';

function Bienvenido() {
  const navigate = useNavigate();

  return (
    <div className="bienvenido-container">
      <h1 className="welcome-title">¡Bienvenido!</h1>
      <p className="instruction-text">Escoja el tipo de dispositivos que le gustaría administrar hoy:</p>
      <div className="button-group">
        <button className="device-button" onClick={() => navigate('/trampa-x')}>Trampa X</button>
        <button className="device-button" onClick={() => navigate('/trampa-electrica')}>Trampa Eléctrica</button>
      </div>
    </div>
  );
}

export default Bienvenido;
