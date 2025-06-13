import React from 'react';
import Header from '../components/Header';
import Bienvenido from '../components/Bienvenido.jsx'; //cambiar
import Footer from '../components/Footer';
import '../styles/pages/Dispositivos.css'; 

function Inicio() {
  return (
    <div className="Inicio">
      <Header />
      <Bienvenido />
      <Footer />
    </div>
  );
}

export default Inicio;
