import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from '../firebase_settings/firebase';
import "../styles/pages/Login.css";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';


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

  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate('/Dispositivos');
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        await auth.signOut(); // Cierra sesión si no está verificado
        setError('Debes verificar tu correo electrónico antes de iniciar sesión.');
        return;
      }
  
      navigate('/Dispositivos');
    } catch (err) {
      setError('Error: Correo o contraseña incorrectos.');
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);

      // Enviar correo de verificación
      await sendEmailVerification(auth.currentUser);

      const sanitizedEmail = registerEmail.replace(/\./g, "");
      const db = getDatabase();
      const userRef = ref(db, 'users/' + sanitizedEmail);
      set(userRef, {
        email: registerEmail,
        username: registerEmail.split('@')[0],
      });

      // Mostrar mensaje de éxito y aviso de verificación
      setShowSuccess(true);
      setRegisterError('Registro exitoso. Revisa tu correo para verificar tu cuenta.');

      setTimeout(() => {
        setShowSuccess(false);
        setRegisterError('');
      }, 5000);

      setShowRegister(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
    } catch (err) {
      setRegisterError('La contraseña debe poseer más de 6 carácteres');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setResetMessage('Error al enviar el correo: ' + err.message);
    }
  };

  const handleClosePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowRegister(false);
      setClosing(false);
    }, 300);
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

        <button className="reset-button" onClick={() => setShowResetForm(true)}>
          ¿Olvidaste tu contraseña?
        </button>

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
                onChange={(e) => setRegisterEmail(e.target.value)} // Puedes reemplazar esto si capturas nombre por separado
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

      {showResetForm && (
        <div className="reset-popup">
          <div className="register-popup-content">
            <h2 className="login-title">Restablecer contraseña</h2>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button className="login-button" type="submit">Enviar enlace</button>
            </form>
            {resetMessage && <p className="login-error">{resetMessage}</p>}
            <button className="close-popup" onClick={() => setShowResetForm(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-toast">
          ¡Registro exitoso! 🎉 Revisa tu correo para verificar tu cuenta.
        </div>
      )}
    </div>
  );
};

export default Login;
