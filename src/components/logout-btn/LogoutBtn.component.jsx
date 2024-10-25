import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase.utills';
import { clearUserInfo, deauthenticateUser } from '../../store/user/userSlice';
import { motion } from 'framer-motion';
import './logout-button.styles.css';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUserInfo());
      dispatch(deauthenticateUser());
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <motion.button
      className="logout-button"
      onClick={handleLogout}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      Logout
    </motion.button>
  );
};

export default LogoutButton;
