import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseLRC } from '../utils/lrcParser';
import styles from './Lyrics.module.css';

export default function Lyrics({ track, currentTime }) {
  const [lines, setLines] = useState([]);
  const [staticText, setStaticText] = useState('');
  const [isLrc, setIsLrc] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines([]); setStaticText(''); setIsLrc(false); setReady(false);
    const load = async () => {
      if (track.lrc) {
        try {
          const r = await fetch(track.lrc);
          if (r.ok) {
            const p = parseLRC(await r.text());
            if (p.length) { setLines(p); setIsLrc(true); setReady(true); return; }
          }
        } catch {}
      }
      if (track.txt) {
        try {
          const r = await fetch(track.txt);
          if (r.ok) { setStaticText(await r.text()); setReady(true); return; }
        } catch {}
      }
      setReady(true);
    };
    load();
  }, [track]);

  let active = -1;
  if (isLrc && lines.length) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].time) { active = i; break; }
    }
  }

  if (isLrc && lines.length) {
    return (
      <div className={styles.box}>
        <AnimatePresence mode="wait">
          {active >= 0 ? (
            <motion.div
              key={active}
              className={styles.karaoke}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {active > 0 && (
                <p className={styles.prev}>{lines[active - 1].text}</p>
              )}
              <p className={styles.active}>{lines[active].text}</p>
              {active < lines.length - 1 && (
                <p className={styles.next}>{lines[active + 1].text}</p>
              )}
            </motion.div>
          ) : (
            <motion.p
              key="wait"
              className={styles.wait}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
            >♪ ♪ ♪</motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (staticText) {
    return (
      <div className={styles.box}>
        <div className={styles.staticWrap}>
          {staticText.split('\n').map((l, i) => (
            <p key={i} className={styles.staticLine}>{l || '\u00A0'}</p>
          ))}
        </div>
      </div>
    );
  }

  return <div className={styles.box}><p className={styles.wait}>♪</p></div>;
}
