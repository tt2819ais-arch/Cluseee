import { useState } from 'react';
import styles from './Background.module.css';

export default function Background({ dominantColor, onVideoStatus }) {
  const [loaded, setLoaded] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  const handleLoad = () => {
    setLoaded(true);
    onVideoStatus?.(true);
  };

  const handleError = () => {
    setHasVideo(false);
    onVideoStatus?.(false);
  };

  const bgStyle = !loaded && dominantColor
    ? { background: `radial-gradient(ellipse at 50% 30%, rgba(${dominantColor}, 0.35) 0%, #000 70%)` }
    : {};

  return (
    <div className={styles.bg} style={bgStyle}>
      {hasVideo && (
        <video
          className={`${styles.video} ${loaded ? styles.visible : ''}`}
          src="/bg.mp4"
          autoPlay loop muted playsInline preload="auto"
          onLoadedData={handleLoad}
          onError={handleError}
        />
      )}
      <div className={styles.overlay} />
    </div>
  );
}
