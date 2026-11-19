import { useId, useState, type CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import type { SectionProps } from '../../../ff/types';
import { defaults, type InteractiveAccordionFeatureConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const VARIANTS: ArtVariant[] = ['blocks', 'waves', 'orbit', 'peaks', 'grid', 'dunes'];

export default function InteractiveAccordionFeature({ config, className }: SectionProps<InteractiveAccordionFeatureConfig>) {
  const c = { ...defaults, ...config };
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  const items = FEATURES.slice(0, 5);
  const toggle = (i: number) => setOpen((o) => (o === i ? (c.collapsible ? null : i) : i));
  // The preview keeps showing the last opened item when everything is collapsed, so the layout never jumps.
  const [shown, setShown] = useState(0);
  const select = (i: number) => { toggle(i); setShown(i); };
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px`, '--ff-a': `${100 - c.previewRatio}fr`, '--ff-b': `${c.previewRatio}fr` } as CSSProperties;
  return (
    <section className={`ff-root ff-interactive-accordion-feature ${className ?? ''}`} style={style} data-side={c.previewSide} aria-labelledby={`${uid}-h`}>
      <div className="ff-interactive-accordion-feature__inner">
        <div className="ff-interactive-accordion-feature__list">
          <h2 id={`${uid}-h`}>Everything connected, nothing duplicated</h2>
          <ul>
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.id} data-open={isOpen || undefined}>
                  <h3>
                    <button type="button" id={`${uid}-b${i}`} aria-expanded={isOpen} aria-controls={`${uid}-p${i}`} onClick={() => select(i)}>
                      {c.showNumbers && <b aria-hidden="true">{String(i + 1).padStart(2, '0')}</b>}
                      <span>{f.title}</span>
                      <ChevronDown size={18} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="ff-interactive-accordion-feature__panel"><div><p>{f.body}</p>{f.stat && <p className="ff-interactive-accordion-feature__stat">{f.stat}</p>}</div></div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="ff-interactive-accordion-feature__preview" aria-hidden="true">
          {items.map((f, i) => (
            <div key={f.id} className="ff-interactive-accordion-feature__slide" data-on={i === shown || undefined}>
              <Art seed={`iaf-${i}`} variant={VARIANTS[i % VARIANTS.length]} hue={i * 58 + 14} decorative ratio="4 / 5" className="ff-interactive-accordion-feature__art" />
              <span>{f.kicker}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
