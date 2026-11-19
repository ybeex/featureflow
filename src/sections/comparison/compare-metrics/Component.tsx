import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type CompareMetricsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

interface Row { label: string; unit: string; lower: boolean; ours: number; them: number; max: number }
const ROWS: Row[] = [
  { label: 'Time to first report', unit: 'min', lower: true, ours: 4, them: 38, max: 40 },
  { label: 'Median query time', unit: 'ms', lower: true, ours: 180, them: 920, max: 1000 },
  { label: 'Setup time', unit: 'hrs', lower: true, ours: 2, them: 14, max: 16 },
  { label: 'Integrations', unit: '', lower: false, ours: 140, them: 62, max: 160 },
  { label: 'Uptime, last 12 months', unit: '%', lower: false, ours: 99.99, them: 99.7, max: 100 },
];

export default function CompareMetrics({ config, scrollRoot = null, reducedMotion, className }: SectionProps<CompareMetricsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(c.animate && !reduced), [c.animate, reduced]);
  const seen = useInView(ref, { root: scrollRoot, threshold: 0.3, once: true, disabled: !armed });
  const rows = c.sort === 'best' ? [...ROWS].sort((a, b) => ratio(b) - ratio(a)) : ROWS;
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-rival': c.rival, '--ff-bar': `${c.barHeight}px`, '--ff-radius': `${c.radius}px`, '--ff-dur': `${c.duration}ms`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-compare-metrics ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby="ff-cm-h">
      <header className="ff-compare-metrics__head">
        <h2 id="ff-cm-h">Measured against the incumbent</h2>
        <ul className="ff-compare-metrics__legend" aria-label="Legend"><li data-k="ours">Lumen</li><li data-k="them">Typical alternative</li></ul>
      </header>
      <div ref={ref} className="ff-compare-metrics__rows" data-visible={seen || undefined}>
        {rows.map((r, i) => (
          <dl key={r.label} className="ff-compare-metrics__row" style={{ '--i': i } as CSSProperties}>
            <dt>{r.label}<span>{r.lower ? 'lower is better' : 'higher is better'}</span></dt>
            {(['ours', 'them'] as const).map((k) => (
              <dd key={k} data-k={k} data-win={(k === 'ours') || undefined}>
                <span className="ff-compare-metrics__track"><i style={{ '--w': `${(r[k] / r.max) * 100}%` } as CSSProperties} /></span>
                {c.showValues && <b>{format(r[k])}{r.unit && ` ${r.unit}`}</b>}
                <span className="ff-visually-hidden">{k === 'ours' ? 'Lumen' : 'Typical alternative'}: {format(r[k])} {r.unit}</span>
              </dd>
            ))}
          </dl>
        ))}
      </div>
    </section>
  );
}

function ratio(r: Row) { return r.lower ? r.them / r.ours : r.ours / r.them; }
function format(n: number) { return Number.isInteger(n) ? n.toLocaleString('en-US') : n.toString(); }
