import { useId, useRef, type CSSProperties } from 'react';
import { Art } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealCircleMaskConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

export default function RevealCircleMask({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealCircleMaskConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollVar(trackRef, { scrollRoot, span: 'pinned', disabled: reduced });
  const span = Math.max(0.05, c.rangeEnd - c.rangeStart);
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-len': c.scrollLength,
    '--ff-start': c.rangeStart, '--ff-span': span, '--ff-r0': c.startSize, '--ff-scrim': c.overlay,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-reveal-circle-mask ${className ?? ''}`} style={style} data-shape={c.maskShape} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <div className="ff-reveal-circle-mask__track" ref={trackRef}>
        <div className="ff-reveal-circle-mask__stage">
          <div className="ff-reveal-circle-mask__base">
            <p className="ff-reveal-circle-mask__eyebrow">Before</p>
            <h2>Scattered tools, scattered focus</h2>
          </div>
          <div className="ff-reveal-circle-mask__reveal">
            <Art seed="mask-reveal" variant="dunes" hue={18} decorative ratio="16 / 9" className="ff-reveal-circle-mask__art" />
            <div className="ff-reveal-circle-mask__scrim" />
            <div className="ff-reveal-circle-mask__text">
              <p className="ff-reveal-circle-mask__eyebrow">After</p>
              <h2 id={headingId}>One calm place to get it done</h2>
              <p>Every request, decision and deadline in a single view that your whole team already understands.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
