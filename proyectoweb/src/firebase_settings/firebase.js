// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTAgQkw3EpO08Jpmz1YWMLUej3uQxw424",
  authDomain: "esp-database-a23e4.firebaseapp.com",
  projectId: "esp-database-a23e4",
  storageBucket: "esp-database-a23e4.firebasestorage.app",
  messagingSenderId: "548318257448",
  appId: "1:548318257448:web:539a56abfa7030b4a5701d",
  measurementId: "G-V127SGS8Q6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };