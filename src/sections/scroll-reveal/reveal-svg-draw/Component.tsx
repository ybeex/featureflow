import { useId, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealSvgDrawConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const STEPS = [
  { t: 'Capture', d: 'Requests arrive from every channel.' },
  { t: 'Triage', d: 'Duplicates merge, owners are assigned.' },
  { t: 'Build', d: 'Work moves through your own stages.' },
  { t: 'Review', d: 'Approvals happen where the work lives.' },
  { t: 'Ship', d: 'Release notes write themselves.' },
];

export default function RevealSvgDraw({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealSvgDrawConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollVar(trackRef, { scrollRoot, span: 'pinned', disabled: reduced });
  const n = Math.max(3, Math.min(5, Math.round(c.steps)));
  const seg = n - 1;
  const W = 800;
  const H = 300;
  const pts = Array.from({ length: n }, (_, i) => ({ x: 70 + (i * (W - 140)) / seg, y: H / 2 + (i % 2 === 0 ? -1 : 1) * c.curvature * 0.9 }));
  const paths = pts.slice(1).map((p, i) => {
    const a = pts[i];
    const dx = (p.x - a.x) / 2;
    return `M${a.x} ${a.y} C${a.x + dx} ${a.y} ${p.x - dx} ${p.y} ${p.x} ${p.y}`;
  });
  const span = Math.max(0.05, c.drawEnd - c.drawStart);
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-sw': c.strokeWidth, '--ff-len': c.scrollLength,
    '--ff-start': c.drawStart, '--ff-span': span, '--ff-n': seg,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-reveal-svg-draw ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <div className="ff-reveal-svg-draw__track" ref={trackRef}>
        <div className="ff-reveal-svg-draw__stage">
          <header className="ff-reveal-svg-draw__head"><p>The workflow</p><h2 id={headingId}>A line that draws your process</h2></header>
          <div className="ff-reveal-svg-draw__figure">
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
              {paths.map((d, i) => (
                <g key={i} style={{ '--k': i } as CSSProperties}>
                  <path d={d} className="ff-reveal-svg-draw__ghost" />
                  <path d={d} pathLength={1} className="ff-reveal-svg-draw__line" />
                </g>
              ))}
              {pts.map((p, i) => (
                <g key={i} className="ff-reveal-svg-draw__node" style={{ '--k': i, transformOrigin: `${p.x}px ${p.y}px` } as CSSProperties}>
                  <circle cx={p.x} cy={p.y} r={c.nodeSize} />
                  <text x={p.x} y={p.y + 5} textAnchor="middle">{i + 1}</text>
                </g>
              ))}
            </svg>
            <ol className="ff-reveal-svg-draw__captions" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {STEPS.slice(0, n).map((s, i) => (
                <li key={s.t} style={{ '--k': i } as CSSProperties}><strong>{s.t}</strong><span>{s.d}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
