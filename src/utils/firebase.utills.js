// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: "questify-e73da.firebaseapp.com",
  projectId: "questify-e73da",
  storageBucket: "questify-e73da.appspot.com",
  messagingSenderId: "830419921215",
  appId: "1:830419921215:web:a38e6587c8ad64a1508b8a"
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
