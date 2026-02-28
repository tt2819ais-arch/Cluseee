import { useCallback } from 'react';
import { formatTime } from '../utils/formatTime';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = useCallback(e => {
    onSeek((parseFloat(e.target.value) / 100) * duration);
  }, [duration, onSeek]);

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.bg}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range" min="0" max="100" step="0.1"
          value={pct} onChange={handleChange}
          className={styles.input}
        />
      </div>
      <div className={styles.times}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
