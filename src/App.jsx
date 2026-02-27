import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Player from './components/Player';
import Playlist from './components/Playlist';
import { useAudio } from './hooks/useAudio';
import styles from './App.module.css';

// Fallback demo tracks if manifest is not found
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
    const loadManifest = async () => {
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
      } catch (e) {
        setTracks(DEMO_TRACKS);
      }
      setLoading(false);
    };

    loadManifest();
  }, []);

  const {
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlay,
    seekTo,
    nextTrack,
    prevTrack,
    selectTrack
  } = useAudio(tracks);

  const currentTrack = tracks[currentTrackIndex] || null;

  if (loading) {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.loading}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Загрузка...
          </motion.span>
        </div>
      </div>
    );
  }

  const isDemoMode = tracks.length === 1 && tracks[0].id === 'demo-silence';

  return (
    <div className={styles.app}>
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
            Треки не найдены. Создайте папку с треком в <code>public/tracks/</code> и
            сгенерируйте манифест:
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
        <motion.div
          className={styles.layout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className={styles.playlistCol}>
            <Playlist
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              onSelectTrack={selectTrack}
            />
          </div>
          <div className={styles.playerCol}>
            <AnimatePresence mode="wait">
              {currentTrack && (
                <Player
                  key="player"
                  track={currentTrack}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  onTogglePlay={togglePlay}
                  onPrev={prevTrack}
                  onNext={nextTrack}
                  onSeek={seekTo}
                  onVolumeChange={setVolume}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
