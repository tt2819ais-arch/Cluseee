import { motion } from 'framer-motion';
import styles from './Controls.module.css';

export default function Controls({ isPlaying, onTogglePlay, onPrev, onNext }) {
  return (
    <div className={styles.controls}>
      <motion.button
        className={styles.btn}
        onClick={onPrev}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        aria-label="Предыдущий"
      >
        ◀◀
      </motion.button>

      <motion.button
        className={`${styles.btn} ${styles.playBtn}`}
        onClick={onTogglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
      >
        {isPlaying ? '||' : '▶'}
      </motion.button>

      <motion.button
        className={styles.btn}
        onClick={onNext}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        aria-label="Следующий"
      >
        ▶▶
      </motion.button>
    </div>
  );
}
