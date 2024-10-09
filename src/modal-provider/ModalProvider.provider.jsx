import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LevelUpModal from '../components/level-up-modal/LevelUpModal.component';
import { confirmLevelUp } from '../store/character/characterSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase.utills';
import { store } from '../store/store';

const ModalProvider = ({ children }) => {
  const { canLevelUp, skills } = useSelector((state) => state.character); // Select skills as well
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (canLevelUp) {
      setShowModal(true);
    }
  }, [canLevelUp]);

  const handleLevelUp = async () => {
    const user = auth.currentUser; // Get the current user
    if (user) {
      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
      dispatch(confirmLevelUp()); // Dispatch the action to level up

      // Get the updated character data from Redux store
      const updatedCharacter = store.getState().character; // Access the character slice

      // Update Firestore with the new level, skill points, and skills
      await updateDoc(userDocRef, {
        character: {
          level: updatedCharacter.level,
          skillPoints: updatedCharacter.skillPoints,
          experience: updatedCharacter.experience, // Store the current XP
          skills: updatedCharacter.skills // Update skills in Firestore
        }
      });

      setShowModal(false); // Close the modal after leveling up
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Manually close the modal
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
