import React from 'react';
import './../styles/components/Login.css'; // si usas estilos adicionales

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="https://media.tenor.com/K2bnpusQYIMAAAAM/silly-cat.gif"
          alt="Logo"
          className="w-10 h-10 mx-auto mb-4" width="150" height="150"/>
          <h1 className="text-2xl font-bold text-center mb-2">¡Bienvenido!</h1>
            <h2 className="text-base text-center mb-6 text-gray-600">
              Inicie sesión para comprobar el estado de sus dispositivos.
            </h2>
              <form className="flex flex-col items-center gap-6">
                <div className="w-full flex flex-col items-center">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 text-center mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-80 px-6 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="w-full flex flex-col items-center">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 text-center mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-80 px-6 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-80 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 text-lg"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

