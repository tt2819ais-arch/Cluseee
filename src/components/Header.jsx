import { motion } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -40, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.logo}>
        <span className={styles.logoText}>Старт</span>
        <span className={styles.logoDot}></span>
      </div>
    </motion.header>
  );
}
