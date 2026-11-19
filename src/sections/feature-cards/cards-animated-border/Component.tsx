import type { CSSProperties } from 'react';
import { Zap, Layers, Compass } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type CardsAnimatedBorderConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const CARDS = [
  { icon: Zap, t: 'Fast by default', d: 'Pages render in the first paint and hydrate only what is interactive.' },
  { icon: Layers, t: 'Composable', d: 'Small parts that fit together, with no hidden global state to fight.' },
  { icon: Compass, t: 'Opinionated paths', d: 'Sensible defaults for the ninety percent case, escape hatches for the rest.' },
];

export default function CardsAnimatedBorder({ config, reducedMotion, paused, className }: SectionProps<CardsAnimatedBorderConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const running = !reduced && !paused;
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-a': c.colorA, '--ff-b': c.colorB, '--ff-dur': `${c.speed}s`, '--ff-th': `${c.thickness}px`,
    '--ff-arc': `${c.arc}deg`, '--ff-cols': c.columns, '--ff-radius': `${c.radius}px`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-cards-animated-border ${className ?? ''}`} style={style} data-run={running || undefined} data-hover-only={c.onHoverOnly || undefined} aria-labelledby="ff-cab-h">
      <header className="ff-cards-animated-border__head"><h2 id="ff-cab-h">A border with somewhere to be</h2></header>
      <ul className="ff-cards-animated-border__grid">
        {CARDS.map((k) => (
          <li key={k.t} className="ff-cards-animated-border__card" tabIndex={0}>
            <div className="ff-cards-animated-border__body">
              <k.icon size={22} aria-hidden="true" />
              <h3>{k.t}</h3>
              <p>{k.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
