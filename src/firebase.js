// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC3VjWl7T8g1H-jfLnu6KtXpg36Bsqe48",
  authDomain: "restaurantvue-5a0a6.firebaseapp.com",
  projectId: "restaurantvue-5a0a6",
  storageBucket: "restaurantvue-5a0a6.firebasestorage.app",
  messagingSenderId: "586771431850",
  appId: "1:586771431850:web:bee8988a30c6408a7debd3",
  measurementId: "G-FX5PFC883N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };