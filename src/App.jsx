import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Background from './components/Background';
import Header from './components/Header';
import Player from './components/Player';
import { useAudio } from './hooks/useAudio';
import styles from './App.module.css';

const DEMO_TRACKS = [
  {
    id: 'demo-silence',
    title: 'Добавьте треки',
    artist: 'Плеер Старт',
    audio: '',
    cover: null,
    lrc: null,
    txt: null
  }
];

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/tracks/manifest.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTracks(data);
          } else {
            setTracks(DEMO_TRACKS);
          }
        } else {
          setTracks(DEMO_TRACKS);
        }
      } catch {
        setTracks(DEMO_TRACKS);
      }
      setLoading(false);
    };
    load();
  }, []);

  const {
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seekTo,
    nextTrack,
    prevTrack,
    selectTrack
  } = useAudio(tracks);

  const currentTrack = tracks[currentTrackIndex] || null;
  const isDemoMode = tracks.length === 1 && tracks[0].id === 'demo-silence';

  if (loading) {
    return (
      <div className={styles.app}>
        <Background />
        <div className={styles.content}>
          <Header />
          <div className={styles.loading}>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Загрузка...
            </motion.span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Background />
      <div className={styles.content}>
        <Header />

        {isDemoMode ? (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={styles.emptyIcon}>♪</div>
            <p className={styles.emptyText}>
              Треки не найдены. Создайте папку с треком в{' '}
              <code>public/tracks/</code> и сгенерируйте манифест:
            </p>
            <div className={styles.emptyCode}>
{`public/tracks/
  ├── my-track/
  │   ├── audio.mp3
  │   ├── cover.jpg
  │   ├── info.json
  │   └── lyrics.lrc (опционально)
  └── manifest.json

npm run manifest`}
            </div>
          </motion.div>
        ) : (
          currentTrack && (
            <Player
              track={currentTrack}
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onTogglePlay={togglePlay}
              onPrev={prevTrack}
              onNext={nextTrack}
              onSeek={seekTo}
              onSelectTrack={selectTrack}
            />
          )
        )}
      </div>
    </div>
  );
}
