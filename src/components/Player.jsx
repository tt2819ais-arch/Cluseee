import { motion, AnimatePresence } from 'framer-motion';
import Cover from './Cover';
import Lyrics from './Lyrics';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import styles from './Player.module.css';

export default function Player({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange
}) {
  if (!track) return null;

  return (
    <motion.div
      className={styles.player}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Cover track={track} isPlaying={isPlaying} />

      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className={styles.trackInfo}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h1 className={styles.title}>{track.title}</h1>
          <p className={styles.artist}>{track.artist}</p>
        </motion.div>
      </AnimatePresence>

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

      <VolumeControl
        volume={volume}
        onVolumeChange={onVolumeChange}
      />

      <Lyrics track={track} currentTime={currentTime} />
    </motion.div>
  );
}
