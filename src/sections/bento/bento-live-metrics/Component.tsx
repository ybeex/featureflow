import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type BentoLiveMetricsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

interface Metric { id: string; label: string; base: number; unit: string; prefix?: string; decimals: number; wide?: boolean }
const METRICS: Metric[] = [
  { id: 'rps', label: 'Requests / second', base: 4820, unit: '', decimals: 0, wide: true },
  { id: 'p95', label: 'p95 latency', base: 182, unit: ' ms', decimals: 0 },
  { id: 'err', label: 'Error rate', base: 0.42, unit: '%', decimals: 2 },
  { id: 'users', label: 'Active users', base: 12840, unit: '', decimals: 0 },
  { id: 'up', label: 'Uptime, 30 days', base: 99.98, unit: '%', decimals: 2 },
  { id: 'rev', label: 'Revenue today', base: 28.4, unit: 'k', prefix: '$', decimals: 1, wide: true },
];

// Small deterministic generator so the first frame is identical on server and client.
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function seriesFor(m: Metric, n: number, vol: number): number[] {
  const r = rng(m.id.length * 997 + m.id.charCodeAt(0));
  let v = m.base;
  return Array.from({ length: n }, () => { v = m.id === 'up' ? Math.min(100, Math.max(99.5, v + (r() - 0.5) * 0.04)) : Math.max(m.base * 0.5, v + (r() - 0.5) * m.base * (vol / 100)); return v; });
}

function Spark({ data, accent }: { data: number[]; accent: string }) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / span) * 26 - 2}`);
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="ff-bento-live-metrics__spark" aria-hidden="true">
      <polygon points={`0,30 ${pts.join(' ')} 100,30`} fill={accent} opacity="0.14" />
      <polyline points={pts.join(' ')} fill="none" stroke={accent} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default function BentoLiveMetrics({ config, reducedMotion, paused, className }: SectionProps<BentoLiveMetricsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const n = Math.max(8, Math.round(c.pointsShown));
  const initial = useMemo(() => METRICS.map((m) => seriesFor(m, n, c.volatility)), [n, c.volatility]);
  const [data, setData] = useState(initial);
  const ref = useRef(initial);
  useEffect(() => { ref.current = initial; setData(initial); }, [initial]);

  const live = !reduced && !paused;
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      ref.current = ref.current.map((arr, i) => {
        const m = METRICS[i];
        const last = arr[arr.length - 1];
        const next = m.id === 'up' ? Math.min(100, Math.max(99.5, last + (Math.random() - 0.5) * 0.04)) : Math.max(m.base * 0.5, last + (Math.random() - 0.5) * m.base * (c.volatility / 100));
        return [...arr.slice(1), next];
      });
      setData(ref.current);
    }, Math.max(300, c.tickMs));
    return () => window.clearInterval(id);
  }, [live, c.tickMs, c.volatility]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px` } as CSSProperties;
  return (
    <section className={`ff-root ff-bento-live-metrics ${className ?? ''}`} style={style} aria-labelledby="ff-blm-h">
      <header className="ff-bento-live-metrics__head">
        <h2 id="ff-blm-h">Production, right now</h2>
        <p className="ff-bento-live-metrics__status"><i data-live={live || undefined} aria-hidden="true" />{live ? 'Live' : 'Paused'}</p>
      </header>
      <ul className="ff-bento-live-metrics__grid">
        {METRICS.map((m, i) => {
          const arr = data[i];
          const cur = arr[arr.length - 1];
          const prev = arr[arr.length - 2] ?? cur;
          const up = cur >= prev;
          const bad = m.id === 'err' || m.id === 'p95' ? up : !up;
          return (
            <li key={m.id} className="ff-bento-live-metrics__tile" data-wide={m.wide || undefined}>
              <p className="ff-bento-live-metrics__label">{m.label}</p>
              <p className="ff-bento-live-metrics__value" aria-live="off">
                {m.prefix}{cur.toLocaleString('en-US', { minimumFractionDigits: m.decimals, maximumFractionDigits: m.decimals })}{m.unit}
              </p>
              <p className="ff-bento-live-metrics__delta" data-bad={bad || undefined}>
                {up ? <ArrowUpRight size={14} aria-hidden="true" /> : <ArrowDownRight size={14} aria-hidden="true" />}
                <span>{up ? 'Up' : 'Down'} {Math.abs(((cur - prev) / (prev || 1)) * 100).toFixed(1)}%</span>
                <span className="ff-visually-hidden"> versus the previous reading, {bad ? 'worse' : 'better'}</span>
              </p>
              {c.sparklines && <Spark data={arr} accent={c.accent} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
