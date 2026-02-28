import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Background from './components/Background';
import SakuraLeaves from './components/SakuraLeaves';
import WelcomeScreen from './components/WelcomeScreen';
import Header from './components/Header';
import Player from './components/Player';
import { useAudio } from './hooks/useAudio';
import { extractColor } from './utils/colorExtractor';
import styles from './App.module.css';

const DEMO = [{
  id: 'demo', title: 'Добавьте треки', artist: 'Старт',
  audio: '', cover: null, lrc: null, txt: null
}];

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [color, setColor] = useState('0,0,0');

  useEffect(() => {
    fetch('/tracks/manifest.json')
      .then(r => r.ok ? r.json() : DEMO)
      .then(d => setTracks(Array.isArray(d) && d.length ? d : DEMO))
      .catch(() => setTracks(DEMO))
      .finally(() => setLoading(false));
  }, []);

  const {
    currentTrackIndex, isPlaying, currentTime, duration,
    togglePlay, seekTo, nextTrack, prevTrack, selectTrack
  } = useAudio(tracks, started);

  const track = tracks[currentTrackIndex] || null;

  // Extract color from cover
  useEffect(() => {
    if (!track?.cover || hasVideo) return;
    if (/\.(mp4|webm|mov)$/i.test(track.cover)) return;
    extractColor(track.cover).then(setColor);
  }, [track, hasVideo]);

  const isDemoMode = tracks.length === 1 && tracks[0].id === 'demo';

  return (
    <div className={styles.app}>
      <Background dominantColor={color} onVideoStatus={setHasVideo} />
      <SakuraLeaves />

      <WelcomeScreen visible={!started} onStart={() => setStarted(true)} />

      <div className={styles.content}>
        <Header />

        {loading ? (
          <div className={styles.msg}>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              Загрузка...
            </motion.span>
          </div>
        ) : isDemoMode ? (
          <motion.div className={styles.empty}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            <p>♪</p>
            <p style={{fontSize:13,color:'#555'}}>Треки не найдены</p>
          </motion.div>
        ) : track && (
          <Player
            track={track} tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying} currentTime={currentTime} duration={duration}
            onTogglePlay={togglePlay} onPrev={prevTrack}
            onNext={nextTrack} onSeek={seekTo} onSelectTrack={selectTrack}
          />
        )}
      </div>
    </div>
  );
}
