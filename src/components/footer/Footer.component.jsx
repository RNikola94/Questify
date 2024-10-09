import { motion } from 'framer-motion';
import './footer.styles.css';

const Footer = () => {
  return (
    <motion.footer 
      className="rpg-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="footer-content">
        <motion.section 
          className="footer-links"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3>Explore</h3>
          <ul>
            <motion.li whileHover={{ scale: 1.1 }}><a href="#about">About</a></motion.li>
            <motion.li whileHover={{ scale: 1.1 }}><a href="#contact">Contact</a></motion.li>
            <motion.li whileHover={{ scale: 1.1 }}><a href="#faq">FAQ</a></motion.li>
            <motion.li whileHover={{ scale: 1.1 }}><a href="#support">Support</a></motion.li>
          </ul>
        </motion.section>

        <motion.section 
          className="footer-logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 whileHover={{ scale: 1.2 }}>Questify</motion.h1>
          <motion.p whileHover={{ color: '#f39c12' }}>"Embark on epic journeys!"</motion.p>
        </motion.section>

        <motion.section 
          className="footer-social"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3>Follow Us</h3>
          <div className="social-icons">
            <motion.a href="https://facebook.com" target="_blank" rel="noreferrer" whileHover={{ scale: 1.2 }}>FB</motion.a>
            <motion.a href="https://twitter.com" target="_blank" rel="noreferrer" whileHover={{ scale: 1.2 }}>TW</motion.a>
            <motion.a href="https://instagram.com" target="_blank" rel="noreferrer" whileHover={{ scale: 1.2 }}>IG</motion.a>
          </div>
        </motion.section>
      </div>

      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© 2024 Questify | All Rights Reserved</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
