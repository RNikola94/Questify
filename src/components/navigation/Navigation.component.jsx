import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DefaultImg from '../../assets/images/default-img.jpg';
import './navigation.styles.css';
import LogoutButton from '../logout-btn/LogoutBtn.component';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsOpen(false);  // Close mobile nav when switching to desktop
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="rpg-nav">
      <div className="nav-logo">
        <h1>Questify</h1>
      </div>

      {/* Desktop Navigation */}
      <ul className={`nav-links ${isMobile ? 'hidden' : ''}`}>
        <motion.li
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a href="#home">Home</a>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a href="#quests">Quests</a>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <a href="#team">Team Quests</a>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <a href="#leaderboard">Leaderboard</a>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          <a href="#profile">
            <img
              src={DefaultImg} // Change this to the actual path of the user's profile picture
              alt="User Profile"
              className="profile-picture"
            />
          </a>
        </motion.li>
        <LogoutButton />
      </ul>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={toggleNav}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Navigation */}
      {isMobile && isOpen && (
        <motion.div
          className="mobile-nav"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4 }}
        >
          <div className='mobile-logo'>
              {/* User profile picture */}
              <img
                src={DefaultImg} // Change this to the actual path of the user's profile picture
                alt="User Profile"
                className="profile-picture"
                onClick={toggleNav} // Optional: Toggle nav when clicking the picture
              />
            </div>
          <ul>
            <li>
              <a href="#home" onClick={toggleNav}>Home</a>
            </li>
            <li>
              <a href="#quests" onClick={toggleNav}>Quests</a>
            </li>
            <li>
              <a href="#team" onClick={toggleNav}>Team Quests</a>
            </li>
            <li>
              <a href="#leaderboard" onClick={toggleNav}>Leaderboard</a>
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
