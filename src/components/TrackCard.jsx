import { motion } from 'framer-motion';
import styles from './TrackCard.module.css';

const fb = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" fill="#1a1a1a"/><text x="18" y="22" text-anchor="middle" fill="#333" font-size="14">♪</text></svg>'
);

function isVideo(s) { return s && /\.(mp4|webm|mov)$/i.test(s); }

export default function TrackCard({ track, isActive, index, onClick }) {
  const src = track.cover;
  return (
    <motion.div
      className={`${styles.card} ${isActive ? styles.on : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {isActive && <div className={styles.line} />}
      <div className={styles.thumb}>
        {isVideo(src)
          ? <video src={src} className={styles.img} autoPlay loop muted playsInline />
          : <img src={src || fb} alt="" className={styles.img} onError={e => { e.target.src = fb; }} />
        }
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>{track.artist}</span>
      </div>
    </motion.div>
  );
}
