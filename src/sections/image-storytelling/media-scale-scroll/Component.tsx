import { useRef, type CSSProperties } from 'react';
import { Art } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type MediaScaleScrollConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

export default function MediaScaleScroll({ config, scrollRoot = null, reducedMotion, className }: SectionProps<MediaScaleScrollConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLDivElement>(null);
  useScrollVar(ref, { scrollRoot, span: 'pinned', disabled: reduced, staticValue: 1 });
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-s0': c.startScale / 100, '--ff-r0': `${c.startRadius}px`, '--ff-overlay': c.overlay, '--ff-len': c.scrollLength, '--ff-cap': c.captionAt,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-media-scale-scroll ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby="ff-mss-h">
      <div ref={ref} className="ff-media-scale-scroll__track">
        <div className="ff-media-scale-scroll__stage">
          <p className="ff-media-scale-scroll__eyebrow">Expedition 07</p>
          <h2 id="ff-mss-h" className="ff-media-scale-scroll__title">Where the road runs out</h2>
          <div className="ff-media-scale-scroll__frame">
            <Art seed="mss" variant="peaks" hue={205} label="A mountain ridge at dawn, an abstract illustration" ratio="auto" className="ff-media-scale-scroll__art" />
            <i className="ff-media-scale-scroll__shade" aria-hidden="true" />
            <p className="ff-media-scale-scroll__caption">Forty-one days, nine ridgelines and one very patient cartographer.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
