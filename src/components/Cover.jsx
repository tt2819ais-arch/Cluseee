import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cover.module.css';

const fallback = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#111"/>
    <text x="100" y="110" text-anchor="middle" fill="#222" font-size="48" font-family="sans-serif">♪</text>
  </svg>`
);

function isVideo(src) {
  if (!src) return false;
  return /\.(mp4|webm|mov)$/i.test(src);
}

export default function Cover({ track, isPlaying }) {
  const src = track.cover;
  const video = isVideo(src);

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className={styles.container}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: isPlaying ? 1 : 0.75, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {video ? (
            <video
              src={src}
              className={styles.img}
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              src={src || fallback}
              alt={track.title}
              className={styles.img}
              onError={(e) => { e.target.src = fallback; }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
