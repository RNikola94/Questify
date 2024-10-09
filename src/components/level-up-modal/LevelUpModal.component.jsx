import { motion } from 'framer-motion';
import './level-up-modal.styles.css';

const LevelUpModal = ({ showModal, onClose, onLevelUp }) => {
  if (!showModal) return null;

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2>Level Up!</h2>
        <p>Congratulations, you've leveled up! Spend your new skill points.</p>
        <button onClick={onLevelUp}>Level Up</button>
        <button onClick={onClose}>Close</button>
      </motion.div>
    </motion.div>
  );
};

export default LevelUpModal;
