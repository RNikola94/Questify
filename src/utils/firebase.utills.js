// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeBwIlkXtZO2SJAdavUrSKoJQaKbxPb3o",
  authDomain: "questify-e73da.firebaseapp.com",
  projectId: "questify-e73da",
  storageBucket: "questify-e73da.appspot.com",
  messagingSenderId: "830419921215",
  appId: "1:830419921215:web:a38e6587c8ad64a1508b8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Utility function to get the XP required for the next level
export const getXPForNextLevel = (level) => {
  return 100 * Math.pow(1.5, level - 1); // Example formula: increasing by 50% per level
};