import { type CSSProperties, type PointerEvent } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type CardsTilt3dConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const CARDS: { t: string; d: string; v: ArtVariant; hue: number }[] = [
  { t: 'Discover', d: 'Find what matters across every tool at once.', v: 'orbit', hue: 24 },
  { t: 'Decide', d: 'Choose with the cost, owner and history in view.', v: 'peaks', hue: 260 },
  { t: 'Deliver', d: 'Ship as one team on a single shared timeline.', v: 'waves', hue: 190 },
];

export default function CardsTilt3d({ config, reducedMotion, className }: SectionProps<CardsTilt3dConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const enabled = !reduced;

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!enabled || e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - y) * 2 * c.maxTilt).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 2 * c.maxTilt).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  };
  const leave = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    for (const p of ['--rx', '--ry']) el.style.setProperty(p, '0deg');
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-persp': `${c.perspective}px`, '--ff-lift': `${c.lift}px`, '--ff-cols': c.columns, '--ff-radius': `${c.radius}px`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-cards-tilt-3d ${className ?? ''}`} style={style} data-on={enabled || undefined} data-glare={c.glare || undefined} data-depth={c.depth || undefined} aria-labelledby="ff-ct-h">
      <header className="ff-cards-tilt-3d__head"><h2 id="ff-ct-h">Cards with real depth</h2></header>
      <ul className="ff-cards-tilt-3d__grid">
        {CARDS.map((k, i) => (
          <li key={k.t} className="ff-cards-tilt-3d__slot">
            <article className="ff-cards-tilt-3d__card" tabIndex={0} onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave}>
              <Art seed={`t3-${i}`} variant={k.v} hue={k.hue} decorative ratio="16 / 10" className="ff-cards-tilt-3d__art" />
              <div className="ff-cards-tilt-3d__text"><h3>{k.t}</h3><p>{k.d}</p></div>
              <i className="ff-cards-tilt-3d__glare" aria-hidden="true" />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
