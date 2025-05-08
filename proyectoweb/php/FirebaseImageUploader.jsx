import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuración de Firebase (reemplaza estos valores con los tuyos)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Componente de carga de imágenes
const FirebaseImageUploader = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para verificar nuevas imágenes
  const checkForNewImages = async () => {
    try {
      setIsLoading(true);
      // Obtener datos del archivo JSON que el PHP actualiza
      const response = await fetch('/firebase_uploads.json');
      
      if (!response.ok) {
        throw new Error('No se pudo recuperar la información de las imágenes');
      }

      const data = await response.json();
      
      // Procesar solo las imágenes nuevas (aquellas que aún no se han subido a Firebase)
      const newImages = data.filter(item => !item.uploaded_to_firebase);
      
      if (newImages.length > 0) {
        await uploadImagesToFirebase(newImages);
      }
      
      setImages(data);
    } catch (err) {
      console.error('Error al verificar nuevas imágenes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para subir imágenes a Firebase Storage
  const uploadImagesToFirebase = async (newImages) => {
    try {
      const updatedImages = [...images];
      
      for (const imageData of newImages) {
        // Obtener la imagen desde la ubicación temporal
        const imageResponse = await fetch(`/temp_uploads/${imageData.filename}`);
        const imageBlob = await imageResponse.blob();
        
        // Crear referencia a la carpeta con el nombre de la imagen
        const folderRef = ref(storage, `images/${imageData.folder_name}`);
        
        // Crear referencia al archivo dentro de la carpeta
        const imageRef = ref(folderRef, imageData.filename);
        
        // Subir la imagen a Firebase Storage
        await uploadBytes(imageRef, imageBlob);
        
        // Obtener URL de descarga
        const downloadURL = await getDownloadURL(imageRef);
        
        // Actualizar el estado de la imagen
        const index = updatedImages.findIndex(img => img.filename === imageData.filename);
        if (index !== -1) {
          updatedImages[index] = {
            ...updatedImages[index],
            uploaded_to_firebase: true,
            download_url: downloadURL
          };
        }
      }
      
      // Actualizar el archivo JSON con la nueva información
      await fetch('/update_firebase_status.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedImages)
      });
      
      setImages(updatedImages);
    } catch (err) {
      console.error('Error al subir imágenes a Firebase:', err);
      setError(err.message);
    }
  };

  // Verificar nuevas imágenes periódicamente
  useEffect(() => {
    // Verificar al cargar el componente
    checkForNewImages();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkForNewImages, 30000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="firebase-image-uploader">
      <h2>Imágenes subidas desde ESP32</h2>
      
      {isLoading && <p>Cargando imágenes...</p>}
      {error && <p className="error">Error: {error}</p>}
      
      <div className="image-gallery">
        {images.filter(img => img.uploaded_to_firebase).map((img, index) => (
          <div key={index} className="image-item">
            <h3>Carpeta: {img.folder_name}</h3>
            <img src={img.download_url} alt={img.filename} width="200" />
            <p>Subido el: {img.timestamp}</p>
          </div>
        ))}
      </div>
      
      <button onClick={checkForNewImages} disabled={isLoading}>
        Verificar nuevas imágenes
      </button>
    </div>
  );
};

export default FirebaseImageUploader;