import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { levelUpCharacter } from '../../store/character/characterSlice';
import { db, auth } from '../../utils/firebase.utills';

const LevelUpButton = () => {
  const dispatch = useDispatch();
  const character = useSelector(state => state.character);

  const handleLevelUp = async () => {
    const user = auth.currentUser;

    if (user) {
      // Dispatch Redux action to level up and add skill points
      dispatch(levelUpCharacter());

      // Update Firestore with new level and skill points
      try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          'character.level': character.level + 1,
          'character.skillPoints': character.skillPoints + 1, // Increment skill points in Firestore
        });
      } catch (error) {
        console.error('Error leveling up: ', error);
      }
    }
  };

  return <button onClick={handleLevelUp}>Level Up</button>;
};

export default LevelUpButton;
