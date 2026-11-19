import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FEATURES } from '../../../ff/sample';
import { easingCss } from '../../../ff/easing';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealFadeStaggerConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const OFFSETS = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] } as const;

export default function RevealFadeStagger({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealFadeStaggerConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  // Content is visible in the server/no-JS markup. Only after mount do we "arm" the hidden start state,
  // so a failed script or reduced motion can never leave the content invisible.
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);

  const once = c.replay === 'once';
  const headVisible = useInView(headRef, { root: scrollRoot, threshold: c.threshold, once, disabled: !armed });
  const gridVisible = useInView(gridRef, { root: scrollRoot, threshold: Math.min(c.threshold, 0.2), once, disabled: !armed });

  const [ox, oy] = OFFSETS[c.direction];
  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-radius': `${c.radius}px`,
    '--ff-dx': `${ox * c.distance}px`,
    '--ff-dy': `${oy * c.distance}px`,
    '--ff-dur': `${c.duration}ms`,
    '--ff-stagger': `${c.stagger}ms`,
    // "Start after a preceding animation": cards wait for the heading's transition to finish.
    '--ff-lead': c.sequence ? `${Math.round(c.duration * 0.6)}ms` : '0ms',
    '--ff-ease': easingCss(c.easing),
    '--ff-cols': c.columns,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-reveal-fade-stagger ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby="ff-rfs-heading">
      <div className="ff-reveal-fade-stagger__inner">
        <div className="ff-reveal-fade-stagger__head ff-reveal-fade-stagger__reveal" ref={headRef} data-visible={headVisible || undefined}>
          <p className="ff-reveal-fade-stagger__eyebrow">Why teams switch</p>
          <h2 id="ff-rfs-heading">Built for the way work actually moves</h2>
          <p>Six capabilities that remove the busywork between an idea and a shipped result.</p>
        </div>
        <ul className="ff-reveal-fade-stagger__grid" ref={gridRef} data-visible={gridVisible || undefined}>
          {FEATURES.map((f, i) => (
            <li key={f.id} className="ff-reveal-fade-stagger__card ff-reveal-fade-stagger__reveal" style={{ '--i': i } as CSSProperties}>
              <span className="ff-reveal-fade-stagger__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
