import { useState, useEffect } from "react";
import { auth, db } from "../../utils/firebase.utills";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import GearItem from "../../components/gear-item/GearItem.component";


const GearInventory = () => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCharacter(docSnap.data().character);
          } else {
            console.log('No character data found');
          }
        } catch (error) {
          console.error("Error fetching character data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user is logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const inventory = character ? character.inventory : [];

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="gear-inventory">
      {inventory.length > 0 ? (
        inventory.map((gear) => (
          <GearItem key={gear.id} gear={gear} />
        ))
      ) : (
        <p>No gear available.</p>
      )}
    </div>
  );
};

export default GearInventory;
