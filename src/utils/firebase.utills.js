// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: "question-47d8b.firebaseapp.com",
  projectId: "question-47d8b",
  storageBucket: "question-47d8b.appspot.com",
  messagingSenderId: "304511789272",
  appId: "1:304511789272:web:171b0eee7d5faa84778fad",
  measurementId: "G-XRMLLBW651"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const getXPForNextLevel = (level) => {
  return 100 * Math.pow(1.5, level - 1);
};

export const updateUserInventoryInFirestore = async (inventory) => {
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      inventory: inventory,
    });
  }
};

export const calculateStats = (state) => {
  const baseStats = statIncrements[state.characterClass];
  state.stats = { ...baseStats };

  state.equippedItems.forEach((item) => {
    if (item.bonuses) {
      Object.keys(item.bonuses).forEach((stat) => {
        state.stats[stat] += item.bonuses[stat];
      });
    }
  });
};
