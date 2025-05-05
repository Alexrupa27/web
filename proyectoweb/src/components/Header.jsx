import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../firebase_settings/firebase'; // Ajusta la ruta si es distinta
import '../styles/components/Header.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const sanitizeEmail = (email) =>
          email.replace(/\./g, ''); 
  
        const emailKey = sanitizeEmail(currentUser.email);
        const userRef = ref(database, `users/${emailKey}/username`);
        try {
          const snapshot = await get(userRef); // <-- CORREGIDO AQUÍ
          if (snapshot.exists()) {
            setUsername(snapshot.val());
          } else {
            setUsername(currentUser.email);
          }
        } catch (error) {
          console.error("Error al obtener el username:", error);
          setUsername(currentUser.email);
        }
      } else {
        setUsername(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUsername(null);
        navigate('/');
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <header className="header">
      <h1 className="logo">Plagatronic</h1>

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/Dispositivos">Inicio</a></li>
          <li><a href="/sobre">Sobre</a></li>
          <li><a href="/contacto">Contacto</a></li>
          {username && (
            <li className="user-dropdown">
              <button className="username-button" onClick={() => setShowDropdown(!showDropdown)}>
                {username}
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </li>
          )}
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
