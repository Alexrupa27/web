import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database, storage, storageRef, getDownloadURL, set, get, remove } from '../firebase_settings/firebase';
import { useNavigate } from 'react-router-dom';
import { ref } from 'firebase/database';
import "../styles/components/ConectaDispositivos.css";

const Home = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceImages, setDeviceImages] = useState({});
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

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
          devicesData.sort((a, b) => b.activat - a.activat);
          setDevices(devicesData);
          devicesData.forEach((device) => loadImage(device.id));
        }
      })
      .catch((error) => console.error("Error al obtener los dispositivos:", error))
      .finally(() => setLoading(false));
  };

  const loadImage = (deviceId) => {
    const imageRef = storageRef(storage, `${deviceId}/${deviceId}.jpg`);
    getDownloadURL(imageRef)
      .then((url) => setDeviceImages((prev) => ({ ...prev, [deviceId]: url })))
      .catch(() => {});
  };

  const handleAddDevice = (email) => {
    if (!newDeviceName || !newDeviceId) {
      alert("Por favor, ingresa tanto el nombre como la ID del dispositivo.");
      return;
    }

    const sanitizedEmail = email.replace(/\./g, '');
    const deviceRef = ref(database, `users/${sanitizedEmail}/devices/${newDeviceId}`);

    get(deviceRef).then((snapshot) => {
      if (snapshot.exists()) {
        alert("Ya existe un dispositivo con esa ID.");
      } else {
        set(deviceRef, { id: newDeviceId, name: newDeviceName, activat: 0 }).then(() => {
          const newDevice = { id: newDeviceId, name: newDeviceName, activat: 0 };
          setDevices((prev) => [...prev, newDevice]);
          setNewDeviceName('');
          setNewDeviceId('');
          setShowModal(false);
        });
      }
    }).catch(console.error);
  };

  const handleDeleteDevice = (deviceId) => {
    const email = getAuth().currentUser.email;
    const sanitizedEmail = email.replace(/\./g, '');
    const deviceRef = ref(database, `users/${sanitizedEmail}/devices/${deviceId}`);

    remove(deviceRef).then(() => {
      setDevices((prev) => prev.filter(device => device.id !== deviceId));
      const imageRef = storageRef(storage, `${deviceId}/${deviceId}.jpg`);
      remove(imageRef).catch(console.error);
    }).catch(console.error)
      .finally(() => {
        setDeviceToEdit(null);
        setShowModal(false);
      });
  };

  const handleOpenEditModal = (deviceId) => {
    setDeviceToEdit(deviceId);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setDeviceToEdit(null);
    setShowModal(false);
  };

  return (
    <div className="home-container">
      <h1 className="title">Bienvenidos a lista de dispositivos</h1>

      {loading ? (
        <p>Cargando dispositivos...</p>
      ) : devices.length > 0 ? (
        <>
          <h2 className="subtitle">Dispositivos</h2>
          <ul className="device-list">
            {devices.map((device) => (
              <li key={device.id} className={`device-item ${device.activat === 1 ? 'active-device' : ''}`}>
                <button onClick={() => handleOpenEditModal(device.id)} className="edit-menu-btn">⋮</button>
                <h3 className="device-name">{device.name}</h3>
                {device.activat === 1 && <div className="activat-badge">✔️ Activado</div>}
                <p className="device-id">ID: {device.id}</p>
                {deviceImages[device.id] ? (
                  <img
                    src={deviceImages[device.id]}
                    alt={device.name}
                    className="device-image"
                    onClick={() => setSelectedImage(deviceImages[device.id])}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <p>No hay imagen disponible para este dispositivo.</p>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No tienes dispositivos.</p>
      )}

      <button className="open-modal-btn" onClick={() => setShowModal(true)}>Añadir dispositivo</button>

      {/* Modal de añadir o editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {deviceToEdit ? (
              <>
                <h2>Opciones del dispositivo</h2>
                <p>ID: {deviceToEdit}</p>
                <div className="modal-buttons">
                  <button onClick={() => handleDeleteDevice(deviceToEdit)} className="cancel-btn">Eliminar</button>
                  <button onClick={handleCancelEdit} className="submit-btn">Cancelar</button>
                </div>
              </>
            ) : (
              <>
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
                  <button onClick={() => handleAddDevice(getAuth().currentUser.email)} className="submit-btn">
                    Añadir
                  </button>
                  <button onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Vista ampliada" className="image-modal-img" />
            <button className="image-modal-close" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
