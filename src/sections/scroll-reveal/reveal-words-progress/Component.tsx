import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useScrollVar } from '../../../ff/useScrollVar';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealWordsProgressConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

// Words wrapped in *asterisks* take the accent colour once they are lit.
const STATEMENT =
  'Most software asks you to adapt to it. Lumen learns how your team already works, quietly connects the *tools* in between, and then gets out of the way so the *work* can finally move.';

interface Word {
  text: string;
  accent: boolean;
}

const WORDS: Word[] = STATEMENT.split(' ').map((raw) => ({
  text: raw.replace(/\*/g, ''),
  accent: raw.includes('*'),
}));

export default function RevealWordsProgress({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealWordsProgressConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const rootRef = useRef<HTMLElement>(null);
  const headingId = useId();

  // The dim start state only exists after mount and only when motion is allowed.
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);

  useScrollVar(rootRef, { scrollRoot, span: 'pinned', disabled: reduced });

  // Every word owns a slice of [rangeStart, rangeEnd]; neighbouring slices overlap so the
  // reading edge feels continuous instead of ticking word by word.
  const { start, step, win } = useMemo(() => {
    const s = Math.min(c.rangeStart, 0.8);
    const e = Math.max(c.rangeEnd, s + 0.1);
    const n = WORDS.length;
    const w = Math.min((e - s) / n * 3, e - s);
    return { start: s, step: n > 1 ? (e - s - w) / (n - 1) : 0, win: Math.max(w, 0.001) };
  }, [c.rangeStart, c.rangeEnd]);

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-s': start,
    '--ff-step': step,
    '--ff-win': win,
    '--ff-dim': c.dimLevel,
    '--ff-y': `${c.yShift}px`,
    '--ff-scale': c.fontScale,
    '--ff-screens': c.screens,
  } as CSSProperties;

  return (
    <section
      ref={rootRef}
      className={`ff-root ff-reveal-words-progress ${className ?? ''}`}
      style={style}
      data-armed={armed || undefined}
      aria-labelledby={headingId}
    >
      <div className="ff-reveal-words-progress__stage">
        <p className="ff-reveal-words-progress__eyebrow">Our approach</p>
        <h2 id={headingId} className="ff-reveal-words-progress__text">
          {WORDS.map((w, i) => (
            <span key={i}>
              <span
                className={`ff-reveal-words-progress__word${w.accent ? ' ff-reveal-words-progress__word--accent' : ''}`}
                style={{ '--i': i } as CSSProperties}
              >
                {w.text}
              </span>
              {i < WORDS.length - 1 ? ' ' : null}
            </span>
          ))}
        </h2>
        <div className="ff-reveal-words-progress__meter" aria-hidden="true">
          <span className="ff-reveal-words-progress__meter-fill" />
        </div>
      </div>
    </section>
  );
}
