import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Gauge, Inbox, Layers, ShieldCheck, Users, Zap, type LucideIcon } from 'lucide-react';
import { Art } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StackPerspectiveDepthConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ICONS: LucideIcon[] = [Inbox, Layers, Zap, Users, Gauge, ShieldCheck];

export default function StackPerspectiveDepth({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StackPerspectiveDepthConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const n = Math.max(2, Math.min(FEATURES.length, Math.round(c.cardCount)));

  // The pinned 3D deck only exists after mount and only without reduced motion.
  // The server / no-JS / reduced-motion markup is a plain readable list of cards.
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);

  const [front, setFront] = useState(0);
  const onProgress = useCallback((p: number) => setFront(Math.round(p * (n - 1))), [n]);
  useScrollVar(trackRef, { scrollRoot, span: 'pinned', disabled: !armed, onProgress });

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-surface': c.surface,
    '--ff-radius': `${c.radius}px`,
    '--ff-persp': `${c.perspective}px`,
    '--ff-step': `${c.depthStep}px`,
    '--ff-rise': `${Math.round(c.depthStep * 0.42)}px`,
    '--ff-tilt': `${c.tilt}deg`,
    '--ff-fade': c.fade,
    '--ff-len-cfg': c.scrollLength,
    '--n': n,
    '--nm1': n - 1,
  } as CSSProperties;

  const current = FEATURES[front % FEATURES.length];

  return (
    <section className={`ff-root ff-stack-perspective-depth ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby={headingId}>
      <div className="ff-stack-perspective-depth__track" ref={trackRef}>
        <div className="ff-stack-perspective-depth__stage">
          <div className="ff-stack-perspective-depth__copy">
            <p className="ff-stack-perspective-depth__eyebrow">The Lumen platform</p>
            <h2 id={headingId}>One deck of capabilities, front to back</h2>
            <p className="ff-stack-perspective-depth__lede">Each card carries one part of the workflow. Scroll and the front card lifts away while the next one steps forward.</p>
            <p className="ff-stack-perspective-depth__counter" aria-live="polite">
              <span>Card {front + 1} of {n}</span>
              <strong>{current.kicker}</strong>
            </p>
          </div>
          <div className="ff-stack-perspective-depth__deck">
            <ol className="ff-stack-perspective-depth__list">
              {Array.from({ length: n }, (_, i) => {
                const f = FEATURES[i % FEATURES.length];
                const Icon = ICONS[i % ICONS.length];
                return (
                  <li key={f.id} className="ff-stack-perspective-depth__card" style={{ '--i': i } as CSSProperties}>
                    <div className="ff-stack-perspective-depth__body">
                      <span className="ff-stack-perspective-depth__icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
                      <p className="ff-stack-perspective-depth__kicker">{String(i + 1).padStart(2, '0')} / {f.kicker}</p>
                      <h3>{f.title}</h3>
                      <p>{f.body}</p>
                      {f.stat && <span className="ff-stack-perspective-depth__stat">{f.stat}</span>}
                    </div>
                    <Art seed={`depth-${f.id}`} hue={250 + i * 22} label={`Illustration for ${f.title}`} ratio="4 / 5" className="ff-stack-perspective-depth__art" />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
