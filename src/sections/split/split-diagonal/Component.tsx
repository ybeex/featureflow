import { useRef, type CSSProperties } from 'react';
import { Art } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type SplitDiagonalConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

export default function SplitDiagonal({ config, scrollRoot = null, reducedMotion, className }: SectionProps<SplitDiagonalConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLElement>(null);
  useScrollVar(ref, { scrollRoot, span: 'pinned', disabled: reduced, staticValue: 0.5 });
  const style = {
    '--ff-left': c.leftColor, '--ff-right': c.rightColor, '--ff-fg': c.textColor, '--ff-accent': c.accent,
    '--ff-skew': c.angle, '--ff-travel': c.travel, '--ff-seam': `${c.seam}px`, '--ff-dir': c.reverse ? -1 : 1,
  } as CSSProperties;
  return (
    <section ref={ref} className={`ff-root ff-split-diagonal ${className ?? ''}`} style={style} data-glow={c.seamGlow || undefined} data-reverse={c.reverse || undefined} data-reduced={reduced || undefined} aria-labelledby="ff-sd-h">
      <div className="ff-split-diagonal__stage">
      <div className="ff-split-diagonal__half ff-split-diagonal__half--a">
        <div className="ff-split-diagonal__content">
          <p className="ff-split-diagonal__kicker">Before</p>
          <h2 id="ff-sd-h">Twelve tabs, nine owners, zero clarity</h2>
          <p>Status lives in chat, plans in slides, decisions in somebody’s memory. Every handoff costs a meeting.</p>
        </div>
        <Art seed="sd-a" variant="blocks" hue={220} decorative ratio="1 / 1" className="ff-split-diagonal__art" />
      </div>
      <div className="ff-split-diagonal__half ff-split-diagonal__half--b">
        <div className="ff-split-diagonal__content">
          <p className="ff-split-diagonal__kicker">After</p>
          <h3>One timeline everyone can read</h3>
          <p>Plans, owners and decisions share a single source of truth. Updates flow to where people already work.</p>
        </div>
        <Art seed="sd-b" variant="dunes" hue={38} decorative ratio="1 / 1" className="ff-split-diagonal__art" />
      </div>
      <i className="ff-split-diagonal__seam" aria-hidden="true" />
      </div>
    </section>
  );
}
