import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration.
// Replace with your actual credentials from your Firebase project.
const firebaseConfig = {
 apiKey: "AIzaSyDos8nRFZp1Wgd2sJc7PUOZ-SGB2Z7QQYY",
 authDomain: "my-data-store-8b60d.firebaseapp.com",
 projectId: "my-data-store-8b60d",
 storageBucket: "my-data-store-8b60d.firebasestorage.app",
 messagingSenderId: "66433322506",
 appId: "1:66433322506:web:ca1b7a7168cdb1dcb959f3",
 measurementId: "G-K9DPWRVXGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication
export const auth = getAuth(app);

// Initialize and export Cloud Firestore
export const db = getFirestore(app);
