import { useCallback } from 'react';
import styles from './VolumeControl.module.css';

export default function VolumeControl({ volume, onVolumeChange }) {
  const handleChange = useCallback(
    (e) => {
      onVolumeChange(parseFloat(e.target.value));
    },
    [onVolumeChange]
  );

  const getIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.35) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  const toggleMute = useCallback(() => {
    onVolumeChange(volume === 0 ? 0.7 : 0);
  }, [volume, onVolumeChange]);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.icon}
        onClick={toggleMute}
        aria-label="Переключить звук"
      >
        {getIcon()}
      </button>
      <div className={styles.sliderWrap}>
        <div className={styles.trackBg}>
          <div
            className={styles.trackFill}
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleChange}
          className={styles.slider}
          aria-label="Громкость"
        />
      </div>
    </div>
  );
}
