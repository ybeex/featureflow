import { useId, useRef, type CSSProperties } from 'react';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StackRotateFanConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

export default function StackRotateFan({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StackRotateFanConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollVar(trackRef, { scrollRoot, span: 'pinned', disabled: reduced });
  const n = Math.max(2, Math.round(c.cardCount));
  const step = n > 1 ? c.fanAngle / (n - 1) : 0;

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent,
    '--ff-n': n, '--ff-step': step, '--ff-pivot': `${c.spreadRadius + c.pivotOffset}px`, '--ff-w': `${c.cardWidth}px`, '--ff-radius': `${c.radius}px`, '--ff-len': c.scrollLength,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-stack-rotate-fan ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <div className="ff-stack-rotate-fan__track" ref={trackRef}>
        <div className="ff-stack-rotate-fan__stage">
          <header className="ff-stack-rotate-fan__head">
            <p>Everything in reach</p>
            <h2 id={headingId}>One pile, fanned into a plan</h2>
          </header>
          <ul className="ff-stack-rotate-fan__deck">
            {Array.from({ length: n }, (_, i) => {
              const f = FEATURES[i % FEATURES.length];
              return (
                <li key={i} className="ff-stack-rotate-fan__card" style={{ '--i': i } as CSSProperties}>
                  <span className="ff-stack-rotate-fan__k">{String(i + 1).padStart(2, '0')} · {f.kicker}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
