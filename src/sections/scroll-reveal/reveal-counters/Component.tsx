import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { STATS } from '../../../ff/sample';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealCountersConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

type Stat = (typeof STATS)[number] & { decimals?: number };

const EASE: Record<string, (t: number) => number> = {
  smooth: (t) => 1 - Math.pow(1 - t, 4),
  snappy: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  gentle: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  bounce: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2),
  linear: (t) => t,
};

const fmt = (v: number, decimals: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);

function Counter({ stat, run, from, duration, delay, easing, reduced }: { stat: Stat; run: boolean; from: number; duration: number; delay: number; easing: string; reduced: boolean }) {
  const decimals = stat.decimals ?? 0;
  const [value, setValue] = useState(stat.value);
  useEffect(() => {
    if (reduced) { setValue(stat.value); return; }
    if (!run) { setValue(from); return; }
    const ease = EASE[easing] ?? EASE.smooth;
    let raf = 0;
    let t0 = 0;
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!t0) t0 = now;
        const t = Math.min(1, (now - t0) / duration);
        setValue(from + (stat.value - from) * ease(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { window.clearTimeout(timer); if (raf) cancelAnimationFrame(raf); };
  }, [run, reduced, from, duration, delay, easing, stat.value]);
  // Visual number is hidden from assistive tech; the final value is announced once via the sr-only text.
  return (
    <>
      <span className="ff-reveal-counters__num" aria-hidden="true">{fmt(value, decimals)}<small>{stat.suffix}</small></span>
      <span className="ff-visually-hidden">{fmt(stat.value, decimals)}{stat.suffix}</span>
    </>
  );
}

export default function RevealCounters({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealCountersConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { root: scrollRoot, threshold: 0.4, once: c.replay === 'once', disabled: reduced });
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px`, '--ff-cols': c.columns,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-reveal-counters ${className ?? ''}`} style={style} aria-labelledby={headingId}>
      <header className="ff-reveal-counters__head"><p>By the numbers</p><h2 id={headingId}>Trusted where it counts</h2></header>
      <ul className="ff-reveal-counters__grid" ref={gridRef}>
        {(STATS as Stat[]).map((s, i) => (
          <li key={s.label} className="ff-reveal-counters__stat">
            <Counter stat={s} run={inView} from={c.startFrom === 'half' ? s.value / 2 : 0} duration={c.duration} delay={i * c.stagger} easing={c.easing} reduced={reduced} />
            <span className="ff-reveal-counters__label">{s.label}</span>
            <span className="ff-reveal-counters__note">{s.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
