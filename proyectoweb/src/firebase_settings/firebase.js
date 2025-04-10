import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqBgvAAg939Rpe5P3ia9-BNJDb_KhBHU8",
  authDomain: "tramparatas-a5771.firebaseapp.com",
  databaseURL: "https://tramparatas-a5771-default-rtdb.firebaseio.com",
  projectId: "tramparatas-a5771",
  storageBucket: "tramparatas-a5771.firebasestorage.app",
  messagingSenderId: "14584722621",
  appId: "1:14584722621:web:00b3d48ffa7096f08733d4",
  measurementId: "G-4CWL7N1490"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
