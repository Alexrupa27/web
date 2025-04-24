import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTAgQkw3EpO08Jpmz1YWMLUej3uQxw424",
  authDomain: "esp-database-a23e4.firebaseapp.com",
  databaseURL: "https://esp-database-a23e4-default-rtdb.firebaseio.com",
  projectId: "esp-database-a23e4",
  storageBucket: "esp-database-a23e4.firebasestorage.app",
  messagingSenderId: "548318257448",
  appId: "1:548318257448:web:539a56abfa7030b4a5701d",
  measurementId: "G-V127SGS8Q6"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
