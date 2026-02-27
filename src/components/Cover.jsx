import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cover.module.css';

const fallbackCover = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="#111"/>
    <text x="150" y="160" text-anchor="middle" fill="#333" font-size="60" font-family="sans-serif">♪</text>
  </svg>`
);

export default function Cover({ track, isPlaying }) {
  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className={styles.coverContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isPlaying ? 1 : 0.8,
            scale: 1
          }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={track.cover || fallbackCover}
            alt={track.title}
            className={styles.cover}
            onError={(e) => { e.target.src = fallbackCover; }}
          />
          <div className={styles.reflection} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
