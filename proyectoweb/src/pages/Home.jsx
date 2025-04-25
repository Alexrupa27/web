import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importamos Firebase Authentication
import { database, storage, storageRef, getDownloadURL, set, get } from '../firebase_settings/firebase'; // Importamos las funciones necesarias para Firebase
import { useNavigate } from 'react-router-dom';  // Usamos useNavigate para redirigir
import { ref } from 'firebase/database'; // Importamos 'ref' de Firebase

const Home = () => {
  const [devices, setDevices] = useState([]);  // Para almacenar los dispositivos
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [deviceImages, setDeviceImages] = useState({}); // Para almacenar las URLs de las imágenes de cada dispositivo
  const [newDeviceName, setNewDeviceName] = useState(''); // Para manejar el nombre del nuevo dispositivo
  const [newDeviceId, setNewDeviceId] = useState(''); // Para manejar la ID del nuevo dispositivo
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  useEffect(() => {
    // Verificamos si el usuario está autenticado
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Si el usuario no está autenticado, redirigimos a la página de login
        navigate('/');
      } else {
        // Si el usuario está autenticado, cargamos los dispositivos
        loadDevices(user.email);
      }
    });

    // Limpiar el listener de autenticación al desmontar el componente
    return () => unsubscribe();
  }, [navigate]);

  const loadDevices = (email) => {
    // Eliminamos los puntos del email
    const sanitizedEmail = email.replace(/\./g, ''); // Quita todos los puntos (.)

    // Ahora usamos el email sin puntos en la ruta
    const devicesRef = ref(database, 'users/' + sanitizedEmail + '/devices'); // Ruta en la base de datos

    // Obtener los dispositivos del usuario
    get(devicesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Si se encuentran dispositivos, los asignamos al estado
          const devicesData = Object.values(snapshot.val());
          setDevices(devicesData); // Convertimos el objeto a un array
          
          // Cargar la imagen de cada dispositivo
          devicesData.forEach((device) => {
            loadImage(device.id); // Aquí cargamos la imagen con el ID de cada dispositivo
          });
        } else {
          console.log("No se encontraron dispositivos");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los dispositivos:", error);
      })
      .finally(() => {
        setLoading(false); // Terminamos la carga
      });
  };

  // Función para cargar la imagen desde Firebase Storage
  const loadImage = (deviceId) => {
    // Usamos la ruta del dispositivo en Storage (por ejemplo, '744DBD89F6CC/744DBD89F6CC.jpg')
    const imageRef = storageRef(storage, `${deviceId}/${deviceId}.jpg`);

    // Obtener la URL de la imagen
    getDownloadURL(imageRef)
      .then((url) => {
        // Se obtiene la URL de la imagen y la asociamos al dispositivo
        setDeviceImages((prevState) => ({
          ...prevState,
          [deviceId]: url, // Guardamos la URL de la imagen para ese dispositivo
        }));
        console.log("URL de la imagen:", url);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de la imagen:", error);
      });
  };

  // Función para manejar la adición de un nuevo dispositivo
  const handleAddDevice = (email) => {
    if (!newDeviceName || !newDeviceId) {
      alert("Por favor, ingresa tanto el nombre como la ID del dispositivo.");
      return;
    }

    // Eliminamos los puntos del email para la clave en Firebase
    const sanitizedEmail = email.replace(/\./g, ''); 

    // Verificar si ya existe un dispositivo con la misma ID
    const deviceRef = ref(database, 'users/' + sanitizedEmail + '/devices/' + newDeviceId); // Verificamos si el dispositivo con esa ID ya existe

    get(deviceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert("Ya existe un dispositivo con esa ID. Por favor, ingresa una ID diferente.");
        } else {
          // Añadimos el dispositivo a la base de datos
          set(deviceRef, {
            id: newDeviceId,  // ID proporcionada por el usuario
            name: newDeviceName,  // Nombre del dispositivo
          })
            .then(() => {
              console.log("Dispositivo añadido con éxito");
              setNewDeviceName(''); // Limpiar el campo de nombre del dispositivo
              setNewDeviceId('');   // Limpiar el campo de ID del dispositivo
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
    <div>
      <h1>Bienvenidos a lista de dispositivos</h1>

      {loading ? (
        <p>Cargando dispositivos...</p>
      ) : (
        devices.length > 0 ? (
          <div>
            <h2>Dispositivos</h2>
            <ul>
              {devices.map((device) => (
                <li key={device.id}>
                  <h3>{device.name}</h3>
                  <p>ID: {device.id}</p>
                  {/* Aquí mostramos la imagen del dispositivo si está disponible */}
                  {deviceImages[device.id] ? (
                    <img src={deviceImages[device.id]} alt={device.name} style={{ width: '200px', height: '200px' }} />
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

      <h2>Añadir un nuevo dispositivo</h2>
      <input
        type="text"
        value={newDeviceName}
        onChange={(e) => setNewDeviceName(e.target.value)} // Actualizamos el estado del nombre del dispositivo
        placeholder="Nombre del dispositivo"
      />
      <input
        type="text"
        value={newDeviceId}
        onChange={(e) => setNewDeviceId(e.target.value)} // Actualizamos el estado de la ID del dispositivo
        placeholder="ID del dispositivo"
      />
      <button onClick={() => handleAddDevice(getAuth().currentUser.email)}>Añadir dispositivo</button>
    </div>
  );
};

export default Home;
