import { useCallback } from 'react';
import { formatTime } from '../utils/formatTime';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = useCallback(
    (e) => {
      const val = parseFloat(e.target.value);
      onSeek((val / 100) * duration);
    },
    [duration, onSeek]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.barContainer}>
        <div className={styles.trackBg}>
          <div
            className={styles.trackFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleChange}
          className={styles.slider}
          aria-label="Прогресс воспроизведения"
        />
      </div>
      <div className={styles.times}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
