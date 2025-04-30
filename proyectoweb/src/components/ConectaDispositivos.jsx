import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database, storage, storageRef, getDownloadURL, set, get } from '../firebase_settings/firebase';
import { useNavigate } from 'react-router-dom';
import { ref } from 'firebase/database';
import classNames from 'classnames';
import "../styles/components/Home.css";

const Home = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceImages, setDeviceImages] = useState({});
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      } else {
        loadDevices(user.email);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadDevices = (email) => {
    const sanitizedEmail = email.replace(/\./g, '');
    const devicesRef = ref(database, 'users/' + sanitizedEmail + '/devices');

    get(devicesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const devicesData = Object.values(snapshot.val());
          setDevices(devicesData);

          devicesData.forEach((device) => {
            loadImage(device.id);
          });
        }
      })
      .catch((error) => {
        console.error("Error al obtener los dispositivos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadImage = (deviceId) => {
    const imageRef = storageRef(storage, `${deviceId}/${deviceId}.jpg`);

    getDownloadURL(imageRef)
      .then((url) => {
        setDeviceImages((prevState) => ({
          ...prevState,
          [deviceId]: url,
        }));
      })
      .catch((error) => {
        console.error("Error al obtener la URL de la imagen:", error);
      });
  };

  const handleAddDevice = (email) => {
    if (!newDeviceName || !newDeviceId) {
      alert("Por favor, ingresa tanto el nombre como la ID del dispositivo.");
      return;
    }

    const sanitizedEmail = email.replace(/\./g, '');

    const deviceRef = ref(database, 'users/' + sanitizedEmail + '/devices/' + newDeviceId);

    get(deviceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert("Ya existe un dispositivo con esa ID.");
        } else {
          set(deviceRef, {
            id: newDeviceId,
            name: newDeviceName,
          })
            .then(() => {
              setNewDeviceName('');
              setNewDeviceId('');
              setShowModal(false);
            })
            .catch((error) => {
              console.error("Error al añadir el dispositivo:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar la ID del dispositivo:", error);
      });
  };

  return (
    <div className="home-container">
      <h1 className="title">Bienvenidos a lista de dispositivos</h1>

      {loading ? (
        <p>Cargando dispositivos...</p>
      ) : (
        devices.length > 0 ? (
          <div>
            <h2 className="subtitle">Dispositivos</h2>
            <ul className="device-list">
              {devices.map((device) => (
                <li key={device.id} className="device-item">
                  <h3 className="device-name">{device.name}</h3>
                  <p className="device-id">ID: {device.id}</p>
                  {deviceImages[device.id] ? (
                    <img
                      src={deviceImages[device.id]}
                      alt={device.name}
                      className="device-image"
                    />
                  ) : (
                    <p>No hay imagen disponible para este dispositivo.</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No tienes dispositivos.</p>
        )
      )}

      <button className="open-modal-btn" onClick={() => setShowModal(true)}>Añadir dispositivo</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Añadir un nuevo dispositivo</h2>
            <input
              type="text"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="Nombre del dispositivo"
              className="input-field"
            />
            <input
              type="text"
              value={newDeviceId}
              onChange={(e) => setNewDeviceId(e.target.value)}
              placeholder="ID del dispositivo"
              className="input-field"
            />
            <div className="modal-buttons">
              <button
                onClick={() => handleAddDevice(getAuth().currentUser.email)}
                className="submit-btn"
              >
                Añadir
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
