import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LevelUpModal from '../components/level-up-modal/LevelUpModal.component';
import { confirmLevelUp } from '../store/character/characterSlice';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase.utills';
import { store } from '../store/store';

const ModalProvider = ({ children }) => {
  const { canLevelUp, skills } = useSelector((state) => state.character);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (canLevelUp) {
      setShowModal(true);
    }
  }, [canLevelUp]);

  const handleLevelUp = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
  
      dispatch(confirmLevelUp());
  
      const updatedCharacter = store.getState().character;
  
      console.log("Updated character data level up: ", updatedCharacter);
  
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const currentCharacter = userDoc.data().character || {};
  
        await updateDoc(userDocRef, {
          character: {
            ...currentCharacter,
            level: updatedCharacter.level,
            skillPoints: updatedCharacter.skillPoints,
            experience: updatedCharacter.experience,
            skills: updatedCharacter.skills,
            stats: updatedCharacter.stats,
            // inventory: updatedCharacter.inventory, 
            // equippedItems: updatedCharacter.equippedItems 
          }
        });
  
        console.log("Data updated in Firestore: ", updatedCharacter);
  
        setShowModal(false);
      }
    }
  };
  
  
  
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {children}
      <LevelUpModal
        showModal={showModal}
        onClose={handleCloseModal}
        onLevelUp={handleLevelUp}
      />
    </>
  );
};

export default ModalProvider;
