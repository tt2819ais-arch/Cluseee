import { useState, useRef, useEffect, useCallback } from 'react';

const KEY_TRACK = 'sp_track';
const KEY_TIME = 'sp_time';

export function useAudio(tracks, started) {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const pendingSeek = useRef(null);
  const didInit = useRef(false);

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Restore saved state
  useEffect(() => {
    if (tracks.length === 0) return;
    const savedId = localStorage.getItem(KEY_TRACK);
    const savedTime = localStorage.getItem(KEY_TIME);
    if (savedId) {
      const idx = tracks.findIndex(t => t.id === savedId);
      if (idx >= 0) {
        setCurrentTrackIndex(idx);
        if (savedTime) {
          pendingSeek.current = parseFloat(savedTime);
          setCurrentTime(parseFloat(savedTime));
        }
      }
    }
    didInit.current = true;
  }, [tracks]);

  // Load track when index changes or after start
  useEffect(() => {
    if (!didInit.current || !audioRef.current || tracks.length === 0) return;
    const audio = audioRef.current;
    const track = tracks[currentTrackIndex];
    if (!track || !track.audio) return;

    audio.pause();
    audio.src = track.audio;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      if (pendingSeek.current !== null) {
        audio.currentTime = pendingSeek.current;
        setCurrentTime(pendingSeek.current);
        pendingSeek.current = null;
      }
      if (started) {
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('loadedmetadata', onLoaded, { once: true });
    audio.load();
    localStorage.setItem(KEY_TRACK, track.id);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [currentTrackIndex, started, tracks]);

  // Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      setCurrentTrackIndex(prev =>
        prev < tracks.length - 1 ? prev + 1 : 0
      );
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, [tracks.length]);

  // Save position periodically
  useEffect(() => {
    const id = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        localStorage.setItem(KEY_TIME, audioRef.current.currentTime.toString());
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.src) return;
    if (a.paused) a.play().catch(() => {}); else a.pause();
  }, []);

  const seekTo = useCallback((t) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t;
    setCurrentTime(t);
  }, []);

  const nextTrack = useCallback(() => {
    pendingSeek.current = null;
    setCurrentTrackIndex(p => (p < tracks.length - 1 ? p + 1 : 0));
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    pendingSeek.current = null;
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex(p => (p > 0 ? p - 1 : tracks.length - 1));
    }
  }, [tracks.length]);

  const selectTrack = useCallback((i) => {
    pendingSeek.current = null;
    setCurrentTrackIndex(i);
  }, []);

  return {
    currentTrackIndex, isPlaying, currentTime, duration,
    togglePlay, seekTo, nextTrack, prevTrack, selectTrack
  };
}
