import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TypeEmphasisScrollConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

// Plain strings are body text; { e } entries are emphasised phrases.
const COPY: (string | { e: string })[] = [
  'Most teams do not have a ', { e: 'tools problem' }, '. They have a ', { e: 'handoff problem' }, ': every time work moves from one person to another, a little context is lost, and ',
  'nobody notices until the launch slips. We built Lumen so that ', { e: 'context travels with the work' }, ', ', 'plans update themselves when reality changes, and ', { e: 'nobody has to ask for a status update ever again' }, '.',
];

export default function TypeEmphasisScroll({ config, scrollRoot = null, reducedMotion, className }: SectionProps<TypeEmphasisScrollConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const root = useRef<HTMLParagraphElement>(null);
  const [on, setOn] = useState<boolean[]>(() => COPY.map(() => false));
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);

  // A phrase is "in focus" while it sits inside a horizontal band around the middle of the scrolling viewport.
  useEffect(() => {
    if (!armed || !root.current || typeof IntersectionObserver === 'undefined') return;
    const band = Math.max(5, Math.min(45, c.bandSize));
    const marks = Array.from(root.current.querySelectorAll<HTMLElement>('[data-k]'));
    const io = new IntersectionObserver((entries) => {
      setOn((prev) => {
        const next = prev.slice();
        for (const e of entries) next[Number((e.target as HTMLElement).dataset.k)] = e.isIntersecting;
        return next;
      });
    }, { root: scrollRoot, rootMargin: `-${50 - band / 2}% 0px -${50 - band / 2}% 0px`, threshold: 0 });
    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [armed, scrollRoot, c.bandSize]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-size': `${c.fontSize}px`, '--ff-fs': c.fontSize, '--ff-th': `${c.thickness}%` } as CSSProperties;
  const anyOn = on.some(Boolean);
  return (
    <section className={`ff-root ff-type-emphasis-scroll ${className ?? ''}`} style={style} data-mark={c.mark} data-armed={armed || undefined} data-dim={(armed && c.dimOthers) || undefined} data-any={anyOn || undefined} aria-labelledby="ff-tes-h">
      <div className="ff-type-emphasis-scroll__inner">
        <h2 id="ff-tes-h" className="ff-type-emphasis-scroll__kicker">Our thesis</h2>
        <p ref={root} className="ff-type-emphasis-scroll__text">
          {COPY.map((part, i) => typeof part === 'string'
            ? <span key={i}>{part}</span>
            : <mark key={i} data-k={i} data-on={on[i] || undefined}>{part.e}</mark>)}
        </p>
      </div>
    </section>
  );
}
