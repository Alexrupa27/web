import React, { useState } from 'react';
import '../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Plagatronic. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
