import { motion } from 'framer-motion';
import styles from './TrackCard.module.css';

const fallbackCover = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <rect width="48" height="48" fill="#1a1a1a"/>
    <text x="24" y="28" text-anchor="middle" fill="#333" font-size="18" font-family="sans-serif">♪</text>
  </svg>`
);

export default function TrackCard({ track, isActive, index, onClick }) {
  return (
    <motion.div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {isActive && (
        <motion.div
          className={styles.activeLine}
          layoutId="activeTrackLine"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <div className={styles.coverWrap}>
        <img
          src={track.cover || fallbackCover}
          alt={track.title}
          className={styles.cover}
          onError={(e) => { e.target.src = fallbackCover; }}
        />
        {isActive && (
          <motion.div
            className={styles.playingIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </motion.div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>{track.artist}</span>
      </div>
    </motion.div>
  );
}
