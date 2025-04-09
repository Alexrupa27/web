// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Asegúrate de que 'Home' tenga la primera letra en mayúscula
import Contact from './Contact'; // Asegúrate de que 'Contact' tenga la primera letra en mayúscula

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
    </Router>
  );
}

export default App;
