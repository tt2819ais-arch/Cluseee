import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseLRC } from '../utils/lrcParser';
import styles from './Lyrics.module.css';

export default function Lyrics({ track, currentTime }) {
  const [lrcLines, setLrcLines] = useState([]);
  const [staticText, setStaticText] = useState('');
  const [isLrc, setIsLrc] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setLrcLines([]);
    setStaticText('');
    setIsLrc(false);

    const loadLyrics = async () => {
      if (track.lrc) {
        try {
          const res = await fetch(track.lrc);
          if (res.ok) {
            const text = await res.text();
            const parsed = parseLRC(text);
            if (parsed.length > 0) {
              setLrcLines(parsed);
              setIsLrc(true);
              setLoading(false);
              return;
            }
          }
        } catch (e) { /* fallthrough */ }
      }

      if (track.txt) {
        try {
          const res = await fetch(track.txt);
          if (res.ok) {
            const text = await res.text();
            setStaticText(text);
            setLoading(false);
            return;
          }
        } catch (e) { /* fallthrough */ }
      }

      setStaticText('');
      setLoading(false);
    };

    loadLyrics();
  }, [track]);

  // Find active line index
  let activeIndex = -1;
  if (isLrc && lrcLines.length > 0) {
    for (let i = lrcLines.length - 1; i >= 0; i--) {
      if (currentTime >= lrcLines[i].time) {
        activeIndex = i;
        break;
      }
    }
  }

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const line = activeLineRef.current;
      const containerRect = container.getBoundingClientRect();
      const lineRect = line.getBoundingClientRect();
      const offset =
        lineRect.top - containerRect.top - containerRect.height / 2 + lineRect.height / 2;

      container.scrollTo({
        top: container.scrollTop + offset,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          className={styles.container}
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading && (
            <p className={styles.placeholder}>Загрузка текста...</p>
          )}

          {!loading && isLrc && lrcLines.map((line, idx) => (
            <p
              key={idx}
              ref={idx === activeIndex ? activeLineRef : null}
              className={`${styles.line} ${idx === activeIndex ? styles.activeLine : ''}`}
            >
              {line.text}
            </p>
          ))}

          {!loading && !isLrc && staticText && (
            <div className={styles.staticText}>
              {staticText.split('\n').map((line, idx) => (
                <p key={idx} className={styles.line}>
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          )}

          {!loading && !isLrc && !staticText && (
            <p className={styles.placeholder}>Текст песни недоступен</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
