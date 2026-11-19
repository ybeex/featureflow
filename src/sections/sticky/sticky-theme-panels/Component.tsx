import { useId, useRef, type CSSProperties } from 'react';
import { easingCss } from '../../../ff/easing';
import { useActiveIndex } from '../../../ff/useActiveIndex';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StickyThemePanelsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

type Pal = { bg: string; fg: string; accent: string };
// Every pair keeps body text above 4.5:1 and the accent above 4.5:1 on its own background.
const PALETTES: Record<StickyThemePanelsConfig['palette'], Pal[]> = {
  editorial: [
    { bg: '#f4efe6', fg: '#1b1a17', accent: '#c2410c' },
    { bg: '#1b1a17', fg: '#f4efe6', accent: '#fb923c' },
    { bg: '#e7efe4', fg: '#14301f', accent: '#166534' },
    { bg: '#f2e8f7', fg: '#2a1136', accent: '#7e22ce' },
  ],
  neon: [
    { bg: '#0b0f1a', fg: '#e8f1ff', accent: '#38bdf8' },
    { bg: '#14091f', fg: '#f5e9ff', accent: '#e879f9' },
    { bg: '#04140f', fg: '#e6fff5', accent: '#34d399' },
    { bg: '#1a1205', fg: '#fff4dc', accent: '#fbbf24' },
  ],
  earth: [
    { bg: '#f6efe3', fg: '#2a2118', accent: '#9a3412' },
    { bg: '#2a2118', fg: '#f6efe3', accent: '#fdba74' },
    { bg: '#e8eee9', fg: '#1c2b22', accent: '#166534' },
    { bg: '#262a33', fg: '#e9ecf3', accent: '#93c5fd' },
  ],
};
const PANELS = [
  { k: 'Listen', t: 'Hear the customer first', d: 'Feedback from calls, tickets and reviews is clustered into themes before anyone has to read a thousand rows.' },
  { k: 'Decide', t: 'Pick what is worth building', d: 'Each theme carries its revenue, urgency and effort, so the trade-offs are visible while the room is still talking.' },
  { k: 'Deliver', t: 'Ship in small, safe steps', d: 'Plans break into releases that can be shipped, measured and rolled back without a heroic weekend.' },
  { k: 'Learn', t: 'Close the loop', d: 'Results flow back to the people who asked, and the next round of listening starts a little smarter.' },
];

export default function StickyThemePanels({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StickyThemePanelsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const n = Math.max(2, Math.min(4, Math.round(c.panels)));
  const [active] = useActiveIndex(listRef, { root: scrollRoot, rootMargin: '-45% 0px -45% 0px' });
  const idx = Math.min(active, n - 1);
  const pal = PALETTES[c.palette][idx];
  const style = {
    '--ff-bg': pal.bg, '--ff-fg': pal.fg, '--ff-accent': pal.accent, '--ff-dur': reduced ? '0ms' : `${c.duration}ms`, '--ff-ease': easingCss(c.easing),
    '--ff-scale': c.textScale, '--ff-top': `${c.stickyOffset}px`, '--ff-progress': (idx + 1) / n,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-sticky-theme-panels ${className ?? ''}`} style={style} aria-labelledby={headingId}>
      <div className="ff-sticky-theme-panels__grid">
        <div className="ff-sticky-theme-panels__stage">
          <p className="ff-sticky-theme-panels__counter" aria-live="polite"><b>{String(idx + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}<span className="ff-visually-hidden"> {PANELS[idx].k}</span></p>
          <h2 id={headingId}>From signal to shipped</h2>
          <p className="ff-sticky-theme-panels__word" aria-hidden="true">{PANELS[idx].k}</p>
          <div className="ff-sticky-theme-panels__bar" role="presentation"><i /></div>
        </div>
        <ol className="ff-sticky-theme-panels__list" ref={listRef}>
          {PANELS.slice(0, n).map((p, i) => (
            <li key={p.k} data-step={i} data-active={i === idx || undefined} aria-current={i === idx ? 'step' : undefined}>
              <p className="ff-sticky-theme-panels__kicker">Part {i + 1} · {p.k}</p>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
