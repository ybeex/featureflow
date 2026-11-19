import { useRef, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type MediaParallaxLayersConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const LAYERS: { v: ArtVariant; hueShift: number; speed: number }[] = [
  { v: 'dunes', hueShift: 0, speed: 0.1 },
  { v: 'peaks', hueShift: 25, speed: 0.35 },
  { v: 'waves', hueShift: 60, speed: 0.65 },
  { v: 'peaks', hueShift: 110, speed: 1 },
];

export default function MediaParallaxLayers({ config, scrollRoot = null, reducedMotion, className }: SectionProps<MediaParallaxLayersConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLElement>(null);
  useScrollVar(ref, { scrollRoot, span: 'pass', disabled: reduced, staticValue: 0.5 });
  const n = Math.max(2, Math.min(LAYERS.length, Math.round(c.layers)));
  const layers = LAYERS.slice(LAYERS.length - n);
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-int': c.intensity, '--ff-mist': c.mist, '--ff-text': c.textDepth, '--ff-h': c.height,
  } as CSSProperties;
  return (
    <section ref={ref} className={`ff-root ff-media-parallax-layers ${className ?? ''}`} style={style} aria-labelledby="ff-mpl-h">
      <div className="ff-media-parallax-layers__scene" aria-hidden="true">
        {layers.map((l, i) => (
          <div key={i} className="ff-media-parallax-layers__layer" style={{ '--speed': l.speed, '--z': i } as CSSProperties}>
            <Art seed={`mpl-${i}`} variant={l.v} hue={c.skyHue + l.hueShift} decorative ratio="auto" className="ff-media-parallax-layers__art" />
          </div>
        ))}
        <i className="ff-media-parallax-layers__mist" />
      </div>
      <div className="ff-media-parallax-layers__copy">
        <p>Field notes</p>
        <h2 id="ff-mpl-h">Every layer moves at its own pace</h2>
        <span>Scroll to feel the distance between things.</span>
      </div>
    </section>
  );
}
