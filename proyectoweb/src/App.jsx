// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dispositivos from './pages/Dispositivos';
import TrampaElectrica from './pages/TrampaElectrica';
import Contacto from './pages/Contacto'; 
import Login from './pages/Login'; 
import Bienvenido from './pages/Inicio';
import PHP from './php/FirebaseImageUploader';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/Dispositivos" element={<Dispositivos />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/Inicio" element={<Bienvenido />} />
          <Route path="/DispositivosTrampaElectrica" element={<TrampaElectrica />} />
          <Route path="/" element={<Login />} />
          <Route path="/PHP" element={<PHP />} />
        </Routes>
    </Router>
  );
}

export default App;
