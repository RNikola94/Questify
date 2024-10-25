import { useDispatch } from 'react-redux';
import { equipGear, unequipGear } from '../../store/character/characterSlice';
import { auth, db } from '../../utils/firebase.utills';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './gear-item.styles.css';

const GearItem = ({ gear }) => {
  const dispatch = useDispatch();

  const handleEquip = async () => {
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, 'users', user.uid);

      // Toggle equip/unequip logic
      if (!gear.isEquipped) {
        dispatch(equipGear(gear.id));

        try {
          await updateDoc(docRef, {
            'character.inventory': arrayRemove(gear),
            'character.equippedItems': arrayUnion({ ...gear, isEquipped: true })
          });
        } catch (error) {
          console.error("Error updating Firestore: ", error);
        }
      } else {
        dispatch(unequipGear(gear.id));

        try {
          await updateDoc(docRef, {
            'character.equippedItems': arrayRemove(gear),
            'character.inventory': arrayUnion({ ...gear, isEquipped: false })
          });
        } catch (error) {
          console.error("Error updating Firestore: ", error);
        }
      }
    }
  };

  return (
    <div className={`gear-item ${gear.isEquipped ? 'equipped' : ''}`}>
      <h3>{gear.name}</h3>
      <p>Type: {gear.type}</p>
      <p>Rarity: {gear.rarity}</p>
      <button onClick={handleEquip}>
        {gear.isEquipped ? 'Unequip' : 'Equip'}
      </button>
      {gear.isEquipped && <span>Equipped</span>}
    </div>
  );
};

export default GearItem;
