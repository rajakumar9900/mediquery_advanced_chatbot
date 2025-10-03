import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE_obvaAaOjPTerU9P1tI2e0SoOq0wg8M",
  authDomain: "mediquery-cceb8.firebaseapp.com",
  projectId: "mediquery-cceb8",
  storageBucket: "mediquery-cceb8.firebasestorage.app",
  messagingSenderId: "113291563824",
  appId: "1:113291563824:web:782de46e103219bae5aef5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
