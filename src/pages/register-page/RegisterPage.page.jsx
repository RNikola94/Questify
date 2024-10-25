import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../utils/firebase.utills';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import './register-page.styles.css';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (formData.username && formData.firstName && formData.lastName) {
      setStep(2);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleRegistration = async () => {
    if (formData.password === formData.confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        dispatch(setUserInfo({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }));

        await setDoc(doc(db, 'users', user.uid), {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });

        navigate('/create-character');
      } catch (error) {
        console.error('Error registering user: ', error);
        alert('Registration failed. Please try again.');
      }
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <motion.div
      className="rpg-registration-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {step === 1 ? (
        <motion.div
          className="rpg-registration-step"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            className="rpg-input"
            type="text"
            placeholder="Username"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            className="rpg-input"
            type="text"
            placeholder="First Name"
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <input
            className="rpg-input"
            type="text"
            placeholder="Last Name"
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <motion.button
            className="rpg-button"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="rpg-registration-step"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            className="rpg-input"
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="rpg-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <input
            className="rpg-input"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <motion.button
            className="rpg-button"
            onClick={handleRegistration}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Registration;
