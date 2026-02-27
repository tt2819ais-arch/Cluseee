import { motion } from 'framer-motion';
import styles from './Controls.module.css';

export default function Controls({ isPlaying, onTogglePlay, onPrev, onNext }) {
  return (
    <div className={styles.controls}>
      <motion.button
        className={styles.btn}
        onClick={onPrev}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Предыдущий трек"
      >
        ◀◀
      </motion.button>

      <motion.button
        className={`${styles.btn} ${styles.playBtn}`}
        onClick={onTogglePlay}
        whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.92 }}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
      >
        {isPlaying ? '⏸' : '▶'}
      </motion.button>

      <motion.button
        className={styles.btn}
        onClick={onNext}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Следующий трек"
      >
        ▶▶
      </motion.button>
    </div>
  );
}
