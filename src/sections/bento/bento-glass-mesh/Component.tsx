import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { Layers, Sparkles, Lock, Gauge, Globe2 } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type BentoGlassMeshConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const TILES = [
  { icon: Layers, t: 'Layered workspaces', d: 'Nest projects as deep as your org chart goes.', cls: 'a' },
  { icon: Sparkles, t: 'Assist that shows its work', d: 'Every suggestion links back to the source.', cls: 'b' },
  { icon: Lock, t: 'Private by default', d: 'Field-level permissions.', cls: 'c' },
  { icon: Gauge, t: '200 ms', d: 'Median query time across 40M records.', cls: 'd' },
  { icon: Globe2, t: 'Three regions', d: 'EU, US and Asia-Pacific residency.', cls: 'e' },
] as const;

export default function BentoGlassMesh({ config, reducedMotion, paused, className }: SectionProps<BentoGlassMeshConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const grid = useRef<HTMLUListElement>(null);

  // Writes pointer position into CSS variables on the tile under the cursor; no React state, no re-render.
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!c.spotlight || e.pointerType === 'touch') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const sx = r.width ? el.offsetWidth / r.width : 1;
    el.style.setProperty('--mx', `${(e.clientX - r.left) * sx}px`);
    el.style.setProperty('--my', `${(e.clientY - r.top) * sx}px`);
  };

  const moving = c.drift && !reduced && !paused;
  const style = {
    '--ff-blur': `${c.blur}px`, '--ff-glass': c.glassOpacity, '--ff-mesh': c.meshIntensity, '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px`,
    '--ff-a': c.colorA, '--ff-b': c.colorB, '--ff-c': c.colorC, '--ff-fg': c.textColor,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-bento-glass-mesh ${className ?? ''}`} style={style} data-drift={moving || undefined} data-spot={c.spotlight || undefined} aria-labelledby="ff-bgm-h">
      <div className="ff-bento-glass-mesh__mesh" aria-hidden="true"><i /><i /><i /></div>
      <header className="ff-bento-glass-mesh__head"><h2 id="ff-bgm-h">Built on glass, designed for focus</h2></header>
      <ul ref={grid} className="ff-bento-glass-mesh__grid">
        {TILES.map((t) => (
          <li key={t.t} className={`ff-bento-glass-mesh__tile ff-bento-glass-mesh__tile--${t.cls}`} onPointerMove={onMove}>
            <t.icon size={22} aria-hidden="true" />
            <h3>{t.t}</h3>
            <p>{t.d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
