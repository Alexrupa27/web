import React from 'react';
import Header from '../components/Header';
import ConectaDispositivos from '../components/ConectaDispositivos'; //cambiar
import Footer from '../components/Footer';
import '../styles/pages/Dispositivos.css'; 

function MenuPrincipal() {
  return (
    <div className="MenuPrincipal">
      <Header />
      <ConectaDispositivos />
      <Footer />
    </div>
  );
}

export default MenuPrincipal;
