import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { confirmLevelUp } from '../../store/character/characterSlice';
import LevelUpModal from '../../components/level-up-modal/LevelUpModal.component';

const CharacterProfile = () => {
  const { canLevelUp } = useSelector((state) => state.character);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (canLevelUp) {
      console.log("Modal should appear");
      setShowModal(true);
    }
  }, [canLevelUp]);
  

  const handleLevelUp = () => {
    dispatch(confirmLevelUp());
    setShowModal(false);  // Close the modal after leveling up
  };

  const handleCloseModal = () => {
    setShowModal(false);  // Manually close the modal
  };

  return (
    <div>
      <h1>Character Info</h1>
      {/* Other character information */}
      
      <LevelUpModal
        showModal={showModal}
        onClose={handleCloseModal}
        onLevelUp={handleLevelUp}
      />
    </div>
  );
};

export default CharacterProfile;
