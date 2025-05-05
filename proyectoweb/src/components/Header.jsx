import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../firebase_settings/firebase';
import '../styles/components/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const sanitizeEmail = (email) =>
          email.replace(/\./g, ','); // solo "." es problemático

        const emailKey = sanitizeEmail(currentUser.email);
        const userRef = ref(database, `users/${emailKey}/username`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUsername(snapshot.val());
          } else {
            setUsername(currentUser.email); // fallback
          }
        } catch (error) {
          console.error('Error al obtener username:', error);
          setUsername(currentUser.email);
        }
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
          <li>
            <a href="/">
              {username ? `Hola, ${username}` : 'Iniciar sesión'}
            </a>
          </li>
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
