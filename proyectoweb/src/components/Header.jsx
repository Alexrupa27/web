import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { ref, get, remove } from 'firebase/database';
import { auth, database } from '../firebase_settings/firebase';
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
        const sanitizeEmail = (email) => email.replace(/\./g, '');
        const emailKey = sanitizeEmail(currentUser.email);
        const usernameRef = ref(database, `users/${emailKey}/username`);

        try {
          const snapshot = await get(usernameRef);
          setUsername(snapshot.exists() ? snapshot.val() : currentUser.email);
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

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const confirmed = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
      if (!confirmed) return;

      try {
        // Eliminar datos del Realtime Database si es necesario
        const emailKey = currentUser.email.replace(/\./g, '');
        await remove(ref(database, `users/${emailKey}`));

        // Eliminar cuenta
        await deleteUser(currentUser);
        alert('Cuenta eliminada correctamente.');
        navigate('/');
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        alert('Error al eliminar la cuenta. Puede que necesites volver a iniciar sesión para realizar esta acción.');
      }
    }
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
                  <button className="delete-button" onClick={handleDeleteAccount}>Eliminar Cuenta</button>
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
