import TrackCard from './TrackCard';
import styles from './Playlist.module.css';

export default function Playlist({ tracks, currentTrackIndex, onSelectTrack }) {
  return (
    <div className={styles.list}>
      <p className={styles.label}>Треки</p>
      <div className={styles.items}>
        {tracks.map((t, i) => (
          <TrackCard
            key={t.id} track={t} index={i}
            isActive={i === currentTrackIndex}
            onClick={() => onSelectTrack(i)}
          />
        ))}
      </div>
    </div>
  );
}
