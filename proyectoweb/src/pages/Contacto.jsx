import React from 'react';
import Header from '../components/Header';
import ConectaDispositivos from '../components/ConectaDispositivos'; //cambiar
import Footer from '../components/Footer';
import '../styles/pages/Dispositivos.css'; 
import Contacto from '../components/Contacto';

function MenuPrincipal() {
  return (
    <div className="MenuPrincipal">
      <Header />
      <Contacto />
      <Footer />
    </div>
  );
}

export default MenuPrincipal;