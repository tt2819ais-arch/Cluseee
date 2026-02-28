import { useState } from 'react';
import styles from './Background.module.css';

export default function Background() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={styles.bg}>
      {!error && (
        <video
          className={`${styles.video} ${loaded ? styles.visible : ''}`}
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      <div className={styles.overlay} />
    </div>
  );
}
