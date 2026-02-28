import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cover.module.css';

const fallback = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#111"/><text x="80" y="88" text-anchor="middle" fill="#222" font-size="40">♪</text></svg>'
);

function isVideo(s) { return s && /\.(mp4|webm|mov)$/i.test(s); }

export default function Cover({ track, isPlaying }) {
  const src = track.cover;
  return (
    <div className={styles.wrap}>
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className={styles.box}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: isPlaying ? 1 : 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {isVideo(src) ? (
            <video src={src} className={styles.img} autoPlay loop muted playsInline />
          ) : (
            <img
              src={src || fallback} alt={track.title}
              className={styles.img}
              onError={e => { e.target.src = fallback; }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
