import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TimelineVerticalProgressConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const EVENTS = [
  { w: 'Week 1', t: 'Kick-off and goals', d: 'Agree what success looks like, who owns it, and how it will be measured.' },
  { w: 'Week 2', t: 'Connect the tools', d: 'Authorise your sources. Data flows in read-only until you say otherwise.' },
  { w: 'Week 4', t: 'Pilot with one team', d: 'A small group runs real work in the new setup and reports what snags.' },
  { w: 'Week 6', t: 'Review the numbers', d: 'Compare cycle time and handoffs against last quarter, honestly.' },
  { w: 'Week 8', t: 'Roll out', d: 'Invite everyone, switch on guardrails, retire the old spreadsheets.' },
  { w: 'Week 12', t: 'Optimise', d: 'Weekly digests point at the next bottleneck so improvements compound.' },
];

export default function TimelineVerticalProgress({ config, scrollRoot = null, reducedMotion, className }: SectionProps<TimelineVerticalProgressConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(reduced ? EVENTS.length : 0);
  const onProgress = useCallback((p: number) => setReached(Math.min(EVENTS.length, Math.floor(p * (EVENTS.length + 0.6)))), []);
  useScrollVar(ref, { scrollRoot, span: 'pass', disabled: reduced, onProgress, staticValue: 1 });
  const n = reduced ? EVENTS.length : reached;
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-line': `${c.lineWidth}px`, '--ff-dim': c.dim, '--ff-radius': `${c.radius}px` } as CSSProperties;
  return (
    <section className={`ff-root ff-timeline-vertical-progress ${className ?? ''}`} style={style} data-layout={c.layout} aria-labelledby="ff-tvp-h">
      <header className="ff-timeline-vertical-progress__head"><p>Rollout plan</p><h2 id="ff-tvp-h">Twelve weeks from kick-off to compounding gains</h2></header>
      <ol ref={ref} className="ff-timeline-vertical-progress__list">
        <li className="ff-timeline-vertical-progress__rail" aria-hidden="true"><i /></li>
        {EVENTS.map((e, i) => {
          const done = i < n;
          return (
            <li key={e.t} className="ff-timeline-vertical-progress__item" data-done={done || undefined} data-side={c.layout === 'alternate' ? (i % 2 ? 'r' : 'l') : 'r'}>
              <span className="ff-timeline-vertical-progress__marker" aria-hidden="true">{c.marker === 'number' ? (done ? <Check size={14} strokeWidth={3} /> : i + 1) : null}</span>
              <article>
                <p className="ff-timeline-vertical-progress__when">{e.w}{done && <span className="ff-visually-hidden"> (reached)</span>}</p>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
