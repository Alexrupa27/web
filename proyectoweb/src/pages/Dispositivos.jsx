import React from 'react';
import Header from '../components/Header';
import ConectaDispositivos from '../components/ConectaDispositivos'; //cambiar
// import './styles/App.css'; 

function MenuPrincipal() {
  return (
    <div className="MenuPrincipal">
      <Header />
      <ConectaDispositivos />
    </div>
  );
}

export default MenuPrincipal;
