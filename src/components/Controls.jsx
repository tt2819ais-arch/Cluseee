import { motion } from 'framer-motion';
import styles from './Controls.module.css';

export default function Controls({ isPlaying, onTogglePlay, onPrev, onNext }) {
  return (
    <div className={styles.row}>
      <motion.button
        className={styles.btn}
        onClick={onPrev}
        whileTap={{ scale: 0.85 }}
      >◀◀</motion.button>

      <motion.button
        className={`${styles.btn} ${styles.play}`}
        onClick={onTogglePlay}
        whileTap={{ scale: 0.88 }}
      >
        {isPlaying ? '| |' : '▶'}
      </motion.button>

      <motion.button
        className={styles.btn}
        onClick={onNext}
        whileTap={{ scale: 0.85 }}
      >▶▶</motion.button>
    </div>
  );
}
