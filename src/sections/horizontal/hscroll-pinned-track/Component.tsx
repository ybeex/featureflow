import { useCallback, useId, useRef, useState, type CSSProperties } from 'react';
import { Art } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type HscrollPinnedTrackConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const clampInt = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));

export default function HscrollPinnedTrack({ config, scrollRoot = null, reducedMotion, className }: SectionProps<HscrollPinnedTrackConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const pinRef = useRef<HTMLDivElement>(null);
  const count = clampInt(c.panelCount, 2, FEATURES.length);
  const [active, setActive] = useState(0);

  // React state changes only when the active panel changes, not on every frame.
  const onProgress = useCallback(
    (p: number) => setActive((prev) => {
      const next = Math.min(count - 1, Math.floor(p * count));
      return next === prev ? prev : next;
    }),
    [count],
  );
  useScrollVar(pinRef, { scrollRoot, span: 'pinned', varName: '--ff-p', onProgress, disabled: reduced, staticValue: 0 });

  // The track starts and ends with an inset so the first and last panels are centred when reached.
  const inset = (100 - c.panelWidth) / 2;
  const distance = Math.max(0, count * c.panelWidth + (count - 1) * c.gap + inset * 2 - 100);

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-pw': `${c.panelWidth}cqw`,
    '--ff-gap': `${c.gap}cqw`,
    '--ff-inset': `${inset}cqw`,
    '--ff-dist': distance,
    '--ff-len': c.scrollLength + 1,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-hscroll-pinned-track ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <div className="ff-hscroll-pinned-track__pin" ref={pinRef}>
        <div className="ff-hscroll-pinned-track__stage">
          <header className="ff-hscroll-pinned-track__head">
            <div>
              <p className="ff-hscroll-pinned-track__eyebrow">The Lumen method</p>
              <h2 id={headingId}>Scroll down, the story moves sideways</h2>
            </div>
            <p className="ff-hscroll-pinned-track__counter" aria-hidden="true">
              Panel {active + 1} of {count}
            </p>
          </header>
          <div className="ff-hscroll-pinned-track__viewport">
            <ol className="ff-hscroll-pinned-track__track">
              {FEATURES.slice(0, count).map((f, i) => (
                <li key={f.id} className="ff-hscroll-pinned-track__panel" data-active={i === active || undefined} aria-label={`Panel ${i + 1} of ${count}`}>
                  <div className="ff-hscroll-pinned-track__copy">
                    <span className="ff-hscroll-pinned-track__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <p className="ff-hscroll-pinned-track__kicker">{f.kicker}</p>
                    <h3>{f.title}</h3>
                    <p className="ff-hscroll-pinned-track__body">{f.body}</p>
                    {f.stat && <p className="ff-hscroll-pinned-track__stat">{f.stat}</p>}
                  </div>
                  <Art seed={`pinned-${f.id}`} hue={12 + i * 52} label={`Illustration for ${f.title}`} ratio="4 / 5" className="ff-hscroll-pinned-track__art" />
                </li>
              ))}
            </ol>
          </div>
          {c.showProgress && (
            <div className="ff-hscroll-pinned-track__progress" role="presentation" aria-hidden="true">
              <span className="ff-hscroll-pinned-track__fill" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
