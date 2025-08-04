import Router from './app/router/index.jsx';
import React, { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"; // Import auth methods'
import {auth} from './app/firebase-config.js'


const signInAsGuest = async () => {
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously!");
    // You can now access auth.currentUser to get the anonymous user's UID
    // which you can use to store their data in Firestore.
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Anonymous sign-in failed:", errorCode, errorMessage);
  }
};

function App() {

  useEffect(() => {
  signInAsGuest();
}, []); // Run once on component mount

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
