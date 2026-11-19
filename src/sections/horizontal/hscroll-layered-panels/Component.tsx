import { useCallback, useId, useRef, useState, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type HscrollLayeredPanelsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const PANELS: { tab: string; t: string; d: string; v: ArtVariant; v2: ArtVariant; hue: number }[] = [
  { tab: 'Discover', t: 'Find the signal', d: 'Search across every tool at once and see what is connected to what.', v: 'dunes', v2: 'orbit', hue: 18 },
  { tab: 'Decide', t: 'Choose with context', d: 'Every option arrives with its cost, owner and the history behind it.', v: 'peaks', v2: 'grid', hue: 210 },
  { tab: 'Deliver', t: 'Move as one team', d: 'Plans, reviews and releases share one timeline everyone can read.', v: 'waves', v2: 'blocks', hue: 280 },
  { tab: 'Measure', t: 'Know it worked', d: 'Outcomes flow back to the original request, closing the loop automatically.', v: 'grid', v2: 'dunes', hue: 150 },
  { tab: 'Improve', t: 'Compound the gains', d: 'Weekly reviews turn the lessons of one quarter into the defaults of the next.', v: 'orbit', v2: 'peaks', hue: 330 },
];

export default function HscrollLayeredPanels({ config, scrollRoot = null, reducedMotion, className }: SectionProps<HscrollLayeredPanelsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const n = Math.max(2, Math.min(PANELS.length, Math.round(c.panels)));
  const [active, setActive] = useState(0);
  const onProgress = useCallback((p: number) => { setActive(Math.round(p * (n - 1))); }, [n]);
  useScrollVar(trackRef, { scrollRoot, span: 'pinned', disabled: reduced, onProgress });

  const jump = (i: number) => {
    const tr = trackRef.current;
    if (!tr) return;
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    const rect = tr.getBoundingClientRect();
    const viewport = scrollRoot ? scrollRoot.clientHeight : window.innerHeight;
    const rootTop = scrollRoot ? scrollRoot.getBoundingClientRect().top : 0;
    const scale = scrollRoot && scrollRoot.clientHeight ? scrollRoot.getBoundingClientRect().height / scrollRoot.clientHeight : 1;
    const trackTop = (rect.top - rootTop) / scale + (scrollRoot ? scrollRoot.scrollTop : window.scrollY);
    const top = trackTop + (i / (n - 1)) * ((rect.height / scale) - viewport);
    if (scrollRoot) scrollRoot.scrollTo({ top, behavior }); else window.scrollTo({ top, behavior });
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-n': n, '--ff-par': c.parallax, '--ff-layer': c.layerOpacity, '--ff-len': c.scrollPerPanel,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-hscroll-layered-panels ${className ?? ''}`} style={style} data-nav={c.navPosition} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <h2 id={headingId} className="ff-visually-hidden">How a quarter of work flows</h2>
      <div className="ff-hscroll-layered-panels__trackwrap" ref={trackRef}>
        <div className="ff-hscroll-layered-panels__stage">
          <nav className="ff-hscroll-layered-panels__tabs" aria-label="Panels">
            {PANELS.slice(0, n).map((p, i) => (
              <button key={p.tab} type="button" onClick={() => jump(i)} aria-current={i === active ? 'true' : undefined}>
                <span aria-hidden="true">{i + 1}</span> {p.tab}
              </button>
            ))}
          </nav>
          <div className="ff-hscroll-layered-panels__strip">
            {PANELS.slice(0, n).map((p, i) => (
              <article key={p.tab} className="ff-hscroll-layered-panels__panel" style={{ '--i': i } as CSSProperties} aria-label={`${i + 1} of ${n}: ${p.tab}`}>
                <div className="ff-hscroll-layered-panels__layer ff-hscroll-layered-panels__layer--far" aria-hidden="true"><Art seed={`lp-far-${i}`} variant={p.v} hue={p.hue} decorative ratio="16 / 9" className="ff-hscroll-layered-panels__art" /></div>
                <div className="ff-hscroll-layered-panels__layer ff-hscroll-layered-panels__layer--mid" aria-hidden="true"><Art seed={`lp-mid-${i}`} variant={p.v2} hue={p.hue + 40} decorative ratio="1 / 1" className="ff-hscroll-layered-panels__blob" /></div>
                <div className="ff-hscroll-layered-panels__card">
                  <p>{String(i + 1).padStart(2, '0')} · {p.tab}</p>
                  <h3>{p.t}</h3>
                  <p className="ff-hscroll-layered-panels__body">{p.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
