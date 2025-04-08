// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home'; // Asegúrate de que 'Home' tenga la primera letra en mayúscula
import Contact from './Contact'; // Asegúrate de que 'Contact' tenga la primera letra en mayúscula

function App() {
  return (
    <Router>
      <div>
        {/* Barra de navegación con enlaces */}
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/Contact">Contacto</Link>
            </li>
          </ul>
        </nav>

        {/* Definir las rutas usando Routes en lugar de Switch */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
