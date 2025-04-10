import React, { useEffect, useState } from 'react';
import { database, ref, onValue } from '../firebase_settings/firebase'; 
const Home = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const devicesRef = ref(database, 'devices');  

    onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Datos obtenidos de Firebase:", data);

      if (data) {
        const deviceList = Object.values(data);
        console.log("Lista de dispositivos:", deviceList);
        setDevices(deviceList);  
      } else {
        console.log("No hay dispositivos en la base de datos.");
      }
    });
  }, []);

  return (
    <div>
      <h1>Bienvenidos a la tienda de dispositivos</h1>
      <h2>Lista de dispositivos</h2>
      <ul>
        {devices.length === 0 ? (
          <li>Cargando dispositivos...</li>
        ) : (
          devices.map((device, index) => (
            <li key={index}>
              <h3>ID: {device.id}</h3>
              <p>Test (Float): {device.test ? device.test.float : 'N/A'}</p>  {/* Accede a float */}
              <p>Test (Int): {device.test ? device.test.int : 'N/A'}</p>      {/* Accede a int */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
