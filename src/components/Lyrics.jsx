import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseLRC } from '../utils/lrcParser';
import styles from './Lyrics.module.css';

export default function Lyrics({ track, currentTime }) {
  const [lrcLines, setLrcLines] = useState([]);
  const [staticText, setStaticText] = useState('');
  const [isLrc, setIsLrc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setLrcLines([]);
    setStaticText('');
    setIsLrc(false);

    const load = async () => {
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
        } catch {}
      }

      if (track.txt) {
        try {
          const res = await fetch(track.txt);
          if (res.ok) {
            setStaticText(await res.text());
            setLoading(false);
            return;
          }
        } catch {}
      }

      setLoading(false);
    };

    load();
  }, [track]);

  let activeIndex = -1;
  if (isLrc && lrcLines.length > 0) {
    for (let i = lrcLines.length - 1; i >= 0; i--) {
      if (currentTime >= lrcLines[i].time) {
        activeIndex = i;
        break;
      }
    }
  }

  // Караоке-режим: только текущая строка
  if (isLrc && lrcLines.length > 0) {
    return (
      <div className={styles.wrapper}>
        <AnimatePresence mode="wait">
          {activeIndex >= 0 ? (
            <motion.div
              key={activeIndex}
              className={styles.karaoke}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activeIndex > 0 && (
                <p className={styles.prevLine}>
                  {lrcLines[activeIndex - 1].text}
                </p>
              )}
              <p className={styles.activeLine}>
                {lrcLines[activeIndex].text}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              className={styles.waiting}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
            >
              ♪♪♪
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Статический текст
  if (staticText) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.staticWrap}>
          {staticText.split('\n').map((line, i) => (
            <p key={i} className={styles.staticLine}>{line || '\u00A0'}</p>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.noLyrics}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.noLyrics}>♪</p>
    </div>
  );
}
