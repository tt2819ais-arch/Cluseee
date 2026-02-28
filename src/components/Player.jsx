import { motion, AnimatePresence } from 'framer-motion';
import Cover from './Cover';
import Lyrics from './Lyrics';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import Playlist from './Playlist';
import styles from './Player.module.css';

export default function Player({
  track, tracks, currentTrackIndex,
  isPlaying, currentTime, duration,
  onTogglePlay, onPrev, onNext, onSeek, onSelectTrack
}) {
  return (
    <motion.div
      className={styles.player}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <Cover track={track} isPlaying={isPlaying} />

      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className={styles.meta}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className={styles.title}>{track.title}</h1>
          <p className={styles.artist}>{track.artist}</p>
        </motion.div>
      </AnimatePresence>

      <Lyrics track={track} currentTime={currentTime} />

      <Controls
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        onPrev={onPrev}
        onNext={onNext}
      />

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      <div className={styles.bottom}>
        <Playlist
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onSelectTrack={onSelectTrack}
        />
      </div>
    </motion.div>
  );
}
