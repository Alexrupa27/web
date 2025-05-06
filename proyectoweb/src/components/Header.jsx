import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { ref, get, remove } from 'firebase/database';
import { auth, database } from '../firebase_settings/firebase';
import '../styles/components/Header.css';
import { useNavigate } from 'react-router-dom';
/* Opciones y comandos importados desde otros documentos */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { /* Codigo para mostrar el username de la persona */
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const sanitizeEmail = (email) => email.replace(/\./g, '');
        const emailKey = sanitizeEmail(currentUser.email);
        const usernameRef = ref(database, `users/${emailKey}/username`); /* La ruta en la base de datos */

        try {
          const snapshot = await get(usernameRef);
          setUsername(snapshot.exists() ? snapshot.val() : currentUser.email);
        } catch (error) {
          console.error("Error al obtener el username:", error); /* Este error no debería salir ya que debe iniciar sesión si o si */
          setUsername(currentUser.email);
        }
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  /* Codigo para detectar el click fuera del menú del usuario */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside); /* Si detecta el click fuera, cierra el menú */
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => { /* Codigo para cerrar la sesión actual y mandar a la persona al login */
    signOut(auth)
      .then(() => {
        setUsername(null);
        navigate('/');
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error); /* Este error no debería ocurrir */
      });
  };

  const handleDeleteAccount = async () => { /* Eliminar cuenta dentro de Firebase */
    const currentUser = auth.currentUser;
    if (currentUser) { /* Confirmación de eliminación de cuenta */
      const confirmed = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
      if (!confirmed) return;

      try {
        const emailKey = currentUser.email.replace(/\./g, '');
        await remove(ref(database, `users/${emailKey}`));
        await deleteUser(currentUser); /* Espera a que el usuario haya sido eliminado para enviar la confirmación */
        alert('Cuenta eliminada correctamente.');
        navigate('/');
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error); /* Este error solo podría salir si la conexión se pierde justo al eliminar la cuenta */
        alert('Error al eliminar la cuenta. Puede que necesites volver a iniciar sesión para realizar esta acción.');
      }
    }
  };

  return (
    <header className="header">
      <h1 className="logo">Plagatronic</h1> {/* Logo de la empresa por cambiar */}

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/Dispositivos">Inicio</a></li>
          <li><a href="/sobre">Sobre</a></li>
          <li><a href="/contacto">Contacto</a></li>
          {username && (
            <li className="user-dropdown" ref={dropdownRef}> {/* Menú del usuario para cerrar o eliminar cuenta */}
              <button className="username-button" onClick={() => setShowDropdown(!showDropdown)}>
                {username}
              </button>
              {showDropdown && (
                <div className="dropdown-menu"> {/* Botones de Cerrar Sesión y Eliminar Cuenta, vinculados a Firebase */}
                  <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                  <button className="delete-button" onClick={handleDeleteAccount}>Eliminar Cuenta</button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>

      <div className="hamburger" onClick={toggleMenu}> {/* Icono de menú que aparece en dispositivos pequeños */}
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Header;
