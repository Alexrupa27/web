import React from 'react';
import Header from '../components/Header';
import Home from './Home'; //cambiar
// import './styles/App.css'; 

function MenuPrincipal() {
  return (
    <div className="MenuPrincipal">
      <Header />
      <Home />
    </div>
  );
}

export default MenuPrincipal;
