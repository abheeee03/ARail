import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBUV8owoiWVQpxSbbKpVfHS3JL9qP2ufE",
  authDomain: "arail-app.firebaseapp.com",
  projectId: "arail-app",
  storageBucket: "arail-app.firebasestorage.app",
  messagingSenderId: "217678370797",
  appId: "1:217678370797:web:f2ad0715f59d3c0d0039e4",
  measurementId: "G-390GK9X5KL"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
