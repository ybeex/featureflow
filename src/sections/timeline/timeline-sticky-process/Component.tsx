import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { Link2, Map, FlaskConical, Rocket, Gauge } from 'lucide-react';
import { STEPS } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TimelineStickyProcessConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ICONS = [Link2, Map, FlaskConical, Rocket, Gauge];
const ALL = [...STEPS, { title: 'Measure the result', body: 'A weekly digest compares cycle time, handoffs and satisfaction with the baseline, so the win is a number, not a feeling.' }];

export default function TimelineStickyProcess({ config, scrollRoot = null, reducedMotion, className }: SectionProps<TimelineStickyProcessConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLDivElement>(null);
  const n = Math.max(2, Math.min(ALL.length, Math.round(c.steps)));
  const [active, setActive] = useState(0);
  const onProgress = useCallback((p: number) => setActive(Math.min(n - 1, Math.floor(p * n))), [n]);
  useScrollVar(ref, { scrollRoot, span: 'pinned', disabled: reduced, onProgress, staticValue: 0 });
  const steps = ALL.slice(0, n);
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-n': n, '--ff-len': c.scrollPerStep } as CSSProperties;
  return (
    <section className={`ff-root ff-timeline-sticky-process ${className ?? ''}`} style={style} data-fx={c.transition} data-reduced={reduced || undefined} aria-labelledby="ff-tsp-h">
      <div ref={ref} className="ff-timeline-sticky-process__track">
        <div className="ff-timeline-sticky-process__stage">
          <h2 id="ff-tsp-h" className="ff-timeline-sticky-process__title">From first connection to first win</h2>
          <ol className="ff-timeline-sticky-process__steps" aria-label="Process steps">
            {steps.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <li key={s.title} data-state={i < active ? 'done' : i === active ? 'active' : 'todo'} aria-current={i === active ? 'step' : undefined}>
                  <span className="ff-timeline-sticky-process__node"><Icon size={18} aria-hidden="true" /></span>
                  <span className="ff-timeline-sticky-process__label">{c.showNumbers && <b>{i + 1}</b>}{s.title}</span>
                </li>
              );
            })}
            <li className="ff-timeline-sticky-process__line" aria-hidden="true"><i /></li>
          </ol>
          <div className="ff-timeline-sticky-process__panels">
            {steps.map((s, i) => (
              <article key={s.title} className="ff-timeline-sticky-process__panel" data-on={i === active || undefined} data-past={i < active || undefined} aria-hidden={reduced ? undefined : i !== active}>
                <p className="ff-timeline-sticky-process__count">Step {i + 1} of {n}</p>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
