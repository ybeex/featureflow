import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TypeSplitLinesConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const LINES = ['Make the work', 'visible, and the', 'meetings optional.'];
const SUB = 'A calmer way for teams to plan, ship and learn.';

export default function TypeSplitLines({ config, scrollRoot = null, reducedMotion, className }: SectionProps<TypeSplitLinesConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);
  const seen = useInView(ref, { root: scrollRoot, threshold: 0.45, once: !c.replay, disabled: !armed });
  const sign = c.direction === 'up' ? 1 : -1;
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-size': `${c.fontSize}px`, '--ff-fs': c.fontSize, '--ff-dist': `${sign * c.distance}%`, '--ff-dur': `${c.duration}ms`, '--ff-stagger': `${c.stagger}ms`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-type-split-lines ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby="ff-tsl-h">
      <div ref={ref} className="ff-type-split-lines__inner" data-visible={seen || undefined}>
        {/* The whole headline is one heading for assistive tech; the per-line spans are visual only. */}
        <h2 id="ff-tsl-h" className="ff-type-split-lines__title" aria-label={LINES.join(' ')}>
          {LINES.map((l, i) => (
            <span key={l} className="ff-type-split-lines__mask" aria-hidden="true"><span className="ff-type-split-lines__line" style={{ '--i': i } as CSSProperties}>{i === LINES.length - 1 ? <>{l.replace('optional.', '')}<em>optional.</em></> : l}</span></span>
          ))}
        </h2>
        <p className="ff-type-split-lines__sub" style={{ '--i': LINES.length } as CSSProperties}>{SUB}</p>
      </div>
    </section>
  );
}
