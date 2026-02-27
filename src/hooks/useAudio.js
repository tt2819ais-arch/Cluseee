import { useState, useRef, useEffect, useCallback } from 'react';

const STORAGE_KEY_TRACK = 'start_player_track';
const STORAGE_KEY_TIME = 'start_player_time';
const STORAGE_KEY_VOLUME = 'start_player_volume';

export function useAudio(tracks) {
  const audioRef = useRef(new Audio());
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasInteracted = useRef(false);
  const saveTimerRef = useRef(null);

  // Restore from localStorage
  useEffect(() => {
    if (tracks.length === 0) return;

    const savedTrack = localStorage.getItem(STORAGE_KEY_TRACK);
    const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
    const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);

    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }

    if (savedTrack) {
      const idx = tracks.findIndex(t => t.id === savedTrack);
      if (idx >= 0) {
        setCurrentTrackIndex(idx);
        if (savedTime) {
          setCurrentTime(parseFloat(savedTime));
        }
      }
    }

    setIsLoaded(true);
  }, [tracks]);

  // Load and play audio
  useEffect(() => {
    if (!isLoaded || tracks.length === 0) return;

    const audio = audioRef.current;
    const track = tracks[currentTrackIndex];
    if (!track) return;

    audio.src = track.audio;
    audio.volume = volume;

    const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
    const savedTrack = localStorage.getItem(STORAGE_KEY_TRACK);

    if (savedTrack === track.id && savedTime) {
      audio.currentTime = parseFloat(savedTime);
      localStorage.removeItem(STORAGE_KEY_TIME);
    }

    if (hasInteracted.current) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }

    localStorage.setItem(STORAGE_KEY_TRACK, track.id);

    return () => {
      audio.pause();
    };
  }, [currentTrackIndex, isLoaded, tracks]);

  // Volume sync
  useEffect(() => {
    audioRef.current.volume = volume;
    localStorage.setItem(STORAGE_KEY_VOLUME, volume.toString());
  }, [volume]);

  // Time update
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        hasInteracted.current = true;
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentTrackIndex, tracks.length]);

  // Periodic save
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        localStorage.setItem(
          STORAGE_KEY_TIME,
          audioRef.current.currentTime.toString()
        );
      }
    }, 3000);

    return () => clearInterval(saveTimerRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    hasInteracted.current = true;
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const nextTrack = useCallback(() => {
    hasInteracted.current = true;
    setCurrentTrackIndex(prev =>
      prev < tracks.length - 1 ? prev + 1 : 0
    );
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    hasInteracted.current = true;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex(prev =>
        prev > 0 ? prev - 1 : tracks.length - 1
      );
    }
  }, [tracks.length]);

  const selectTrack = useCallback((index) => {
    hasInteracted.current = true;
    setCurrentTrackIndex(index);
  }, []);

  return {
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
    selectTrack,
    audioRef
  };
}
