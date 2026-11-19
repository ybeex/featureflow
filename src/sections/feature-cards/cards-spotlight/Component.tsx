import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { Search, Workflow, ShieldCheck, LineChart, Users, Plug } from 'lucide-react';
import { FEATURES } from '../../../ff/sample';
import type { SectionProps } from '../../../ff/types';
import { defaults, type CardsSpotlightConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ICONS = [Search, Workflow, Plug, Users, LineChart, ShieldCheck];

export default function CardsSpotlight({ config, className }: SectionProps<CardsSpotlightConfig>) {
  const c = { ...defaults, ...config };
  const grid = useRef<HTMLUListElement>(null);

  // One handler on the grid: every card gets the pointer position relative to itself, written as CSS variables.
  // No React state, so moving the pointer never re-renders.
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === 'touch') return;
    for (const card of Array.from(e.currentTarget.children) as HTMLElement[]) {
      const r = card.getBoundingClientRect();
      const k = r.width ? card.offsetWidth / r.width : 1;
      card.style.setProperty('--mx', `${(e.clientX - r.left) * k}px`);
      card.style.setProperty('--my', `${(e.clientY - r.top) * k}px`);
    }
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-cols': c.columns, '--ff-spot': `${c.spotlightSize}px`, '--ff-strength': c.spotlightStrength,
    '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-cards-spotlight ${className ?? ''}`} style={style} data-border={c.borderGlow || undefined} aria-labelledby="ff-cs-h">
      <header className="ff-cards-spotlight__head"><h2 id="ff-cs-h">Light follows your cursor</h2><p>The spotlight is shared across the grid, so neighbouring cards glow as it passes between them.</p></header>
      <ul ref={grid} className="ff-cards-spotlight__grid" onPointerMove={onMove}>
        {FEATURES.map((f, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <li key={f.id} className="ff-cards-spotlight__card">
              <div className="ff-cards-spotlight__inner">
                <Icon size={22} aria-hidden="true" />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
