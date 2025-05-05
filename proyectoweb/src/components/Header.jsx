import React, { useState } from 'react';
import '../styles/components/Header.css'; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <h1 className="logo">Plagatronic</h1>
      
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/Dispositivos">Inicio</a></li>
          <li><a href="/sobre">Sobre</a></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
      </nav>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Header;
