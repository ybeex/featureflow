import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { easingCss } from '../../../ff/easing';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type RevealClipImageConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ROWS: { variant: ArtVariant; hue: number; kicker: string; title: string; text: string }[] = [
  { variant: 'dunes', hue: 24, kicker: 'Plan', title: 'Start from the destination', text: 'Describe the outcome and Lumen drafts the route: milestones, owners and the first week of work.' },
  { variant: 'peaks', hue: 200, kicker: 'Build', title: 'Keep every climb in view', text: 'Progress rolls up from the smallest task to the quarterly goal, with the blockers surfaced early.' },
  { variant: 'waves', hue: 280, kicker: 'Ship', title: 'Land it without the scramble', text: 'Checklists, approvals and announcements are prepared in advance, so launch day feels routine.' },
];
const CYCLE = ['left', 'right', 'center'] as const;

function Row({ i, c, root, armed }: { i: number; c: RevealClipImageConfig; root: HTMLElement | null; armed: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { root, threshold: c.threshold, once: c.replay === 'once', disabled: !armed });
  const r = ROWS[i];
  const dir = c.direction === 'alternate' ? CYCLE[i % 3] : c.direction;
  return (
    <article ref={ref} className="ff-reveal-clip-image__row" data-flip={i % 2 === 1 || undefined} data-dir={dir} data-visible={visible || undefined}>
      <div className="ff-reveal-clip-image__frame">
        <div className="ff-reveal-clip-image__mask"><Art seed={`clip-${i}`} variant={r.variant} hue={r.hue} ratio={`${c.imageRatio} / 1`} label={`${r.title}: abstract illustration`} className="ff-reveal-clip-image__art" /></div>
      </div>
      <div className="ff-reveal-clip-image__copy">
        <p className="ff-reveal-clip-image__kicker">{String(i + 1).padStart(2, '0')} · {r.kicker}</p>
        <h3>{r.title}</h3>
        <p>{r.text}</p>
      </div>
    </article>
  );
}

export default function RevealClipImage({ config, scrollRoot = null, reducedMotion, className }: SectionProps<RevealClipImageConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px`,
    '--ff-dur': `${c.duration}ms`, '--ff-ease': easingCss(c.easing),
  } as CSSProperties;
  return (
    <section className={`ff-root ff-reveal-clip-image ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby={headingId}>
      <header className="ff-reveal-clip-image__head"><p>From idea to launch</p><h2 id={headingId}>Pictures that unveil themselves</h2></header>
      <div className="ff-reveal-clip-image__rows">{ROWS.map((_, i) => <Row key={i} i={i} c={c} root={scrollRoot} armed={armed} />)}</div>
    </section>
  );
}
