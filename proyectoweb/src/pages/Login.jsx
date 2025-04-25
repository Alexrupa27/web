import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'; // Importa para trabajar con la base de datos
import { auth } from '../firebase_settings/firebase'; // Usamos el auth ya exportado de firebase.js
import "../styles/components/Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [closing, setClosing] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      
      // Reemplazamos los puntos (.) en el correo con nada (eliminarlos)
      const sanitizedEmail = registerEmail.replace(/\./g, ""); // Eliminar todos los puntos

      // Crear un nuevo usuario en Firebase Realtime Database
      const db = getDatabase();
      const userRef = ref(db, 'users/' + sanitizedEmail); // Usa el correo sin puntos como la clave del usuario
      set(userRef, {
        email: registerEmail,
        username: registerEmail.split('@')[0],  // Extraemos el nombre de usuario del correo
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // El mensaje de éxito desaparece después de 3 segundos

      setShowRegister(false); // Cierra el popup
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setRegisterError('');
    } catch (err) {
      setRegisterError('Error al registrarse: ' + err.message);
    }
  };

  const handleClosePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowRegister(false);
      setClosing(false);
    }, 300); // coincide con la duración de la animación CSS
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-button" type="submit">Iniciar sesión</button>
        </form>
        <div className="register-section">
          <p>¿No tienes cuenta?</p>
          <button className="register-button" onClick={() => setShowRegister(true)}>Registrarse</button>
        </div>
      </div>

      {showRegister && (
        <div className="register-popup">
          <div className={`register-popup-content ${closing ? 'fade-out' : 'fade-in'}`}>
            <h2 className="login-title">Registro</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nombre completo"
                required
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {registerError && <p className="login-error">{registerError}</p>}
              <button className="login-button" type="submit">Registrarse</button>
            </form>
            <button className="close-popup" onClick={handleClosePopup}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Mostrar el mensaje de éxito al registrarse */}
      {showSuccess && (
        <div className="success-toast">
          ¡Registro exitoso! 🎉
        </div>
      )}
    </div>
  );
};

export default Login;
