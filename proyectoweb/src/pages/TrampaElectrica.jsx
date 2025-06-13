import React from 'react';
import Header from '../components/Header';
import ConectaTrampaElectrica from '../components/ConectaTrampaElectrica';
import Footer from '../components/Footer';
import '../styles/pages/Dispositivos.css'; 

function TrampaElectrica() {
  return (
    <div className="TrampaElectrica">
      <Header />
      <ConectaTrampaElectrica />
      <Footer />
    </div>
  );
}

export default TrampaElectrica;
