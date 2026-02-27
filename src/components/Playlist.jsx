import { motion } from 'framer-motion';
import TrackCard from './TrackCard';
import styles from './Playlist.module.css';

export default function Playlist({ tracks, currentTrackIndex, onSelectTrack }) {
  return (
    <motion.div
      className={styles.playlist}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className={styles.heading}>Плейлист</h2>
      <div className={styles.list}>
        {tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            isActive={index === currentTrackIndex}
            onClick={() => onSelectTrack(index)}
          />
        ))}
      </div>
    </motion.div>
  );
}
