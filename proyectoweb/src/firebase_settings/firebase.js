import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get, remove } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage'; // Correct import
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
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

// Initialize Firebase only if it's not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { database, storage, ref, onValue, set, get, remove, storageRef, getDownloadURL, uploadBytes, auth }; // Correct export

