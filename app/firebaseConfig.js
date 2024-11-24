// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHlJ-2Tui6XinLiInIbcBfr6GVR2uLOcA",
  authDomain: "buildmate-9456a.firebaseapp.com",
  projectId: "buildmate-9456a",
  storageBucket: "buildmate-9456a.firebasestorage.app",
  messagingSenderId: "1069196931948",
  appId: "1:1069196931948:web:74602e480938f6fa88f949",
  measurementId: "G-L5VGGTYR1Z"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

