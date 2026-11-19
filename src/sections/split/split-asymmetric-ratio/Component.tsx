import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type SplitAsymmetricRatioConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const VARIANTS: ArtVariant[] = ['dunes', 'blocks', 'waves', 'peaks', 'orbit', 'grid'];

function Row({ i, scrollRoot, armed, alt }: { i: number; scrollRoot: HTMLElement | null; armed: boolean; alt: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { root: scrollRoot, threshold: 0.25, once: true, disabled: !armed });
  const f = FEATURES[i];
  return (
    <article ref={ref} className="ff-split-asymmetric-ratio__row" data-flip={alt && i % 2 === 1 ? '' : undefined} data-visible={visible || undefined}>
      <div className="ff-split-asymmetric-ratio__media">
        <Art seed={`sar-${i}`} variant={VARIANTS[i % VARIANTS.length]} hue={i * 61 + 15} ratio="4 / 3" label={`${f.title}: illustration`} className="ff-split-asymmetric-ratio__art" />
      </div>
      <div className="ff-split-asymmetric-ratio__copy">
        <p className="ff-split-asymmetric-ratio__kicker">{f.kicker}</p>
        <h3>{f.title}</h3>
        <p>{f.body}</p>
        {f.stat && <p className="ff-split-asymmetric-ratio__stat">{f.stat}</p>}
      </div>
    </article>
  );
}

export default function SplitAsymmetricRatio({ config, scrollRoot = null, reducedMotion, className }: SectionProps<SplitAsymmetricRatioConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(c.reveal && !reduced), [c.reveal, reduced]);
  const rows = Math.max(1, Math.min(FEATURES.length, Math.round(c.rows)));
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-a': `${c.ratio}fr`, '--ff-b': `${100 - c.ratio}fr`, '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px`,
    '--ff-align': c.align === 'start' ? 'start' : c.align === 'end' ? 'end' : 'center',
  } as CSSProperties;
  return (
    <section className={`ff-root ff-split-asymmetric-ratio ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby="ff-sar-h">
      <header className="ff-split-asymmetric-ratio__head"><h2 id="ff-sar-h">One workspace, three ways in</h2></header>
      <div className="ff-split-asymmetric-ratio__rows">
        {Array.from({ length: rows }, (_, i) => <Row key={i} i={i} scrollRoot={scrollRoot} armed={armed} alt={c.alternate} />)}
      </div>
    </section>
  );
}
