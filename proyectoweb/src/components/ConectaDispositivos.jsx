import React, { useEffect, useState, useRef } from 'react';
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

  const modalRef = useRef(null);
  const imageModalRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setDeviceToEdit(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => document.removeEventListener('mousedown', handleClickOutsideModal);
  }, [showModal]);

  useEffect(() => {
    const handleClickOutsideImage = (event) => {
      if (selectedImage && imageModalRef.current && !imageModalRef.current.contains(event.target)) {
        setSelectedImage(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideImage);
    return () => document.removeEventListener('mousedown', handleClickOutsideImage);
  }, [selectedImage]);

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

  const handleUpdateDevice = () => {
    const email = getAuth().currentUser.email;
    const sanitizedEmail = email.replace(/\./g, '');

    const oldRef = ref(database, `users/${sanitizedEmail}/devices/${deviceToEdit}`);
    const newRef = ref(database, `users/${sanitizedEmail}/devices/${newDeviceId}`);

    const updatedDevice = { id: newDeviceId, name: newDeviceName, activat: 0 };

    if (deviceToEdit !== newDeviceId) {
      get(newRef).then((snapshot) => {
        if (snapshot.exists()) {
          alert("Ya existe un dispositivo con esta nueva ID.");
        } else {
          set(newRef, updatedDevice).then(() => {
            remove(oldRef).then(() => {
              setDevices((prev) =>
                prev.map((d) =>
                  d.id === deviceToEdit ? updatedDevice : d
                )
              );
              setDeviceToEdit(null);
              setShowModal(false);
            });
          });
        }
      });
    } else {
      set(oldRef, updatedDevice).then(() => {
        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceToEdit ? updatedDevice : d
          )
        );
        setDeviceToEdit(null);
        setShowModal(false);
      });
    }
  };

  const handleDeleteConfirmation = () => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este dispositivo? Esta acción no se puede deshacer.");
    if (confirm) {
      handleDeleteDevice(deviceToEdit);
    }
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
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setDeviceToEdit(deviceId);
      setNewDeviceName(device.name);
      setNewDeviceId(device.id);
      setShowModal(true);
    }
  };

  const handleCancelEdit = () => {
    setDeviceToEdit(null);
    setShowModal(false);
  };

  // Nueva función para desactivar el dispositivo
  const handleDeactivateDevice = (deviceId) => {
    const email = getAuth().currentUser.email;
    const sanitizedEmail = email.replace(/\./g, '');
    const deviceRef = ref(database, `users/${sanitizedEmail}/devices/${deviceId}`);

    set(deviceRef, { activat: 0 }).then(() => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, activat: 0 } : device
        )
      );
    }).catch(console.error);
  };

  return (
    <div className="cd-home-container">
      <h1 className="cd-title">Bienvenidos a lista de dispositivos</h1>

      <div className="cd-header-actions">
        <button className="cd-open-modal-btn" onClick={() => setShowModal(true)}>Añadir dispositivo</button>
      </div>

      {loading ? (
        <p>Cargando dispositivos...</p>
      ) : devices.length > 0 ? (
        <>
          <h2 className="cd-subtitle">Dispositivos</h2>
          <ul className="cd-device-list">
            {devices.map((device) => (
              <li key={device.id} className={`cd-device-item ${device.activat === 1 ? 'cd-active-device' : ''}`}>
                <button onClick={() => handleOpenEditModal(device.id)} className="cd-edit-menu-btn">⋮</button>
                <h3 className="cd-device-name">{device.name}</h3>
                {device.activat === 1 && <div className="cd-activat-badge">✔️ Activado</div>}
                <p className="cd-device-id">ID: {device.id}</p>
                {deviceImages[device.id] ? (
                  <img
                    src={deviceImages[device.id]}
                    alt={device.name}
                    className="cd-device-image"
                    onClick={() => setSelectedImage(deviceImages[device.id])}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <p>No hay imagen disponible para este dispositivo.</p>
                )}

                {/* Botón de desactivación */}
                {device.activat === 1 && (
  <button
    onClick={() => {
      const confirmed = window.confirm(`¿Estás seguro de que deseas desactivar el dispositivo "${device.name}"?`);
      if (confirmed) {
        handleDeactivateDevice(device.id);
      }
    }}
    className="cd-deactivate-btn"
  >
    Desactivar
  </button>
)}

              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No tienes dispositivos.</p>
      )}

      {showModal && (
        <div className="cd-modal-overlay">
          <div ref={modalRef} className={`cd-modal-content ${deviceToEdit ? 'cd-edit-mode' : ''}`}>
            {deviceToEdit ? (
              <>
                <h2>Editar dispositivo</h2>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Nuevo nombre del dispositivo"
                  className="cd-input-field"
                />
                <input
                  type="text"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  placeholder="Nuevo ID del dispositivo"
                  className="cd-input-field"
                />
                <div className="cd-modal-buttons">
                  <button onClick={handleUpdateDevice} className="cd-submit-btn">Guardar cambios</button>
                  <button onClick={handleDeleteConfirmation} className="cd-delete-btn">Eliminar</button>
                  <button onClick={handleCancelEdit} className="cd-cancel-btn">Cancelar</button>
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
                  className="cd-input-field"
                />
                <input
                  type="text"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  placeholder="ID del dispositivo"
                  className="cd-input-field"
                />
                <div className="cd-modal-buttons">
                  <button onClick={() => handleAddDevice(getAuth().currentUser.email)} className="cd-submit-btn">
                    Añadir
                  </button>
                  <button onClick={() => setShowModal(false)} className="cd-cancel-btn">Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="cd-image-modal-overlay">
          <div ref={imageModalRef} className="cd-image-modal-content">
            <img src={selectedImage} alt="Vista ampliada" className="cd-image-modal-img" />
            <button className="cd-image-modal-close" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
