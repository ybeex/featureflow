import { useRef, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type SplitIndependentScrollConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const V: ArtVariant[] = ['dunes', 'orbit', 'waves', 'peaks', 'grid', 'blocks'];

export default function SplitIndependentScroll({ config, scrollRoot = null, reducedMotion, className }: SectionProps<SplitIndependentScrollConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLDivElement>(null);
  useScrollVar(ref, { scrollRoot, span: 'pinned', disabled: reduced, staticValue: 0 });
  const n = Math.max(3, Math.min(FEATURES.length, Math.round(c.cards)));
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px`,
    '--ff-speed': c.speed, '--ff-n': n,
  } as CSSProperties;
  const list = FEATURES.slice(0, n);
  return (
    <section className={`ff-root ff-split-independent-scroll ${className ?? ''}`} style={style} data-dir={c.direction} data-reduced={reduced || undefined} aria-labelledby="ff-sis-h">
      <div ref={ref} className="ff-split-independent-scroll__track">
        <div className="ff-split-independent-scroll__stage">
          <div className="ff-split-independent-scroll__col ff-split-independent-scroll__col--text">
            <div className="ff-split-independent-scroll__slide">
              <p className="ff-split-independent-scroll__kicker">Two lanes, one story</p>
              <h2 id="ff-sis-h">Read on the left. See it on the right.</h2>
              <ol>
                {list.map((f, i) => (
                  <li key={f.id}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3>{f.title}</h3><p>{f.body}</p></div></li>
                ))}
              </ol>
            </div>
          </div>
          <div className="ff-split-independent-scroll__col ff-split-independent-scroll__col--media" aria-hidden="true">
            <div className="ff-split-independent-scroll__slide">
              {list.map((f, i) => <Art key={f.id} seed={`sis-${i}`} variant={V[i % V.length]} hue={i * 55 + 200} decorative ratio="4 / 3" className="ff-split-independent-scroll__art" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
