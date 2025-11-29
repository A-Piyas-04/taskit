import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB4tI0tvAE7hsO8zSGA1SWsIszBuj8x148",
    authDomain: "taskit-ce7e0.firebaseapp.com",
    projectId: "taskit-ce7e0",
    storageBucket: "taskit-ce7e0.firebasestorage.app",
    messagingSenderId: "288009140388",
    appId: "1:288009140388:web:5d7491ea9ad5b96cf3ce31",
    measurementId: "G-K0L08GYQF4"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
