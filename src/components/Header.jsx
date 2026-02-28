import { motion } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.logo}>Старт</span>
    </motion.header>
  );
}
