// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dispositivos from './pages/Dispositivos';
import Contact from './pages/Contact'; 
import Login from './pages/Login'; 

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/Dispositivos" element={<Dispositivos />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
