// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Asegúrate de que 'Home' tenga la primera letra en mayúscula
import Contact from './pages/Contact'; // Asegúrate de que 'Contact' tenga la primera letra en mayúscula
import Login from './pages/Login'; // Asegúrate de que 'Contact' tenga la primera letra en mayúscula

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
