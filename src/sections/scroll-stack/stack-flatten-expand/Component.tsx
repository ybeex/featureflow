import { useId, useRef, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StackFlattenExpandConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const TONES = ['#f2c9a8', '#cfe3d4', '#cdd5f2', '#f0d4e4', '#e9e2a8', '#c9e4ea'];
const VARIANTS: ArtVariant[] = ['dunes', 'orbit', 'waves', 'peaks', 'grid', 'blocks'];

function Panel({ index, scrollRoot, reduced }: { index: number; scrollRoot: HTMLElement | null; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  // "pass" progress: 0 as the panel enters at the bottom, ~0.62 when it reaches the top of the scroller.
  useScrollVar(ref, { scrollRoot, span: 'pass', disabled: reduced, staticValue: 0.7 });
  const f = FEATURES[index % FEATURES.length];
  return (
    <li ref={ref} className="ff-stack-flatten-expand__slot" style={{ '--i': index, '--tone': TONES[index % TONES.length] } as CSSProperties}>
      <article className="ff-stack-flatten-expand__panel">
        <div className="ff-stack-flatten-expand__copy">
          <p>{String(index + 1).padStart(2, '0')} / {f.kicker}</p>
          <h3>{f.title}</h3>
          <p className="ff-stack-flatten-expand__body">{f.body}</p>
        </div>
        <Art seed={`flat-${f.id}`} variant={VARIANTS[index % VARIANTS.length]} hue={index * 55 + 10} ratio="4 / 3" label={`Illustration for ${f.title}`} className="ff-stack-flatten-expand__art" />
      </article>
    </li>
  );
}

export default function StackFlattenExpand({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StackFlattenExpandConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent,
    '--ff-start': c.startWidth, '--ff-r0': `${c.startRadius}px`, '--ff-r1': `${c.finalRadius}px`, '--ff-tilt': c.tilt, '--ff-top': `${c.stickyOffset}px`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-stack-flatten-expand ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <header className="ff-stack-flatten-expand__head"><p>Panel by panel</p><h2 id={headingId}>Each idea takes the whole stage</h2></header>
      <ol className="ff-stack-flatten-expand__list">
        {Array.from({ length: Math.max(2, Math.round(c.cardCount)) }, (_, i) => <Panel key={i} index={i} scrollRoot={scrollRoot} reduced={reduced} />)}
      </ol>
    </section>
  );
}
