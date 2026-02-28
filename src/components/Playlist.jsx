import { motion } from 'framer-motion';
import TrackCard from './TrackCard';
import styles from './Playlist.module.css';

export default function Playlist({ tracks, currentTrackIndex, onSelectTrack }) {
  return (
    <div className={styles.playlist}>
      <p className={styles.heading}>Треки</p>
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
    </div>
  );
}
