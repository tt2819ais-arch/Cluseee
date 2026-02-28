import { useMemo } from 'react';
import styles from './SakuraLeaves.module.css';

const LEAF_COUNT = 18;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function SakuraLeaves() {
  const leaves = useMemo(() =>
    Array.from({ length: LEAF_COUNT }, (_, i) => ({
      id: i,
      left: `${random(0, 100)}%`,
      size: random(14, 30),
      duration: random(9, 16),
      delay: random(0, 12),
      drift: random(-80, 80),
      rotate: random(180, 720),
      opacity: random(0.4, 0.8),
    })),
    []
  );

  return (
    <div className={styles.container} aria-hidden="true">
      {leaves.map(l => (
        <div
          key={l.id}
          className={styles.leaf}
          style={{
            left: l.left,
            width: `${l.size}px`,
            height: `${l.size}px`,
            opacity: l.opacity,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            '--drift': `${l.drift}px`,
            '--rot': `${l.rotate}deg`,
          }}
        >
          <img src="/pidr.jpg" alt="" className={styles.img} />
        </div>
      ))}
    </div>
  );
}
