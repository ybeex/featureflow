import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { BarChart3, Layers, Zap } from 'lucide-react';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealBlurSweepConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const LINES = ['Lumen reads the work you already do,', 'then arranges it into the plan', 'you would have written yourself.'];
const ROWS = [
  { Icon: Zap, t: 'Instant setup', d: 'Connect your tools and see a populated workspace in minutes, not weeks.' },
  { Icon: Layers, t: 'Structure that adapts', d: 'Projects, labels and owners follow how your team really works.' },
  { Icon: BarChart3, t: 'Answers on demand', d: 'Ask in plain language and pin the chart that comes back.' },
];

export default function RevealBlurSweep({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealBlurSweepConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);
  const visible = useInView(ref, { root: scrollRoot, threshold: c.threshold, once: c.replay === 'once', disabled: !armed });
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-blur': `${c.blur}px`, '--ff-dur': `${c.duration}ms`,
    '--ff-gap': `${c.sequenceGap}ms`, '--ff-angle': `${c.sweepAngle}deg`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-reveal-blur-sweep ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby={headingId}>
      <div className="ff-reveal-blur-sweep__inner" ref={ref} data-visible={visible || undefined}>
        <h2 id={headingId} className="ff-reveal-blur-sweep__title">Software that does the arranging</h2>
        <p className="ff-reveal-blur-sweep__lead">
          {LINES.map((l, i) => <span key={i} className="ff-reveal-blur-sweep__line" style={{ '--n': i } as CSSProperties}>{l}</span>)}
        </p>
        <ul className="ff-reveal-blur-sweep__rows">
          {ROWS.map(({ Icon, t, d }, i) => (
            <li key={t} className="ff-reveal-blur-sweep__row" style={{ '--r': i } as CSSProperties}>
              <span className="ff-reveal-blur-sweep__icon"><Icon size={22} aria-hidden="true" /></span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
