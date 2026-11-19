import { useRef, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type ExpPerspectiveSceneConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ITEMS: { t: string; d: string; v: ArtVariant }[] = [
  { t: 'Arrive', d: 'Start at the entrance, where everything is still quiet.', v: 'dunes' },
  { t: 'Descend', d: 'Each panel sits deeper in the scene than the last.', v: 'peaks' },
  { t: 'Drift', d: 'The camera glides forward as you scroll.', v: 'waves' },
  { t: 'Cross', d: 'Panels pass on alternating sides of the corridor.', v: 'orbit' },
  { t: 'Dive', d: 'Distance fades into fog, so only the nearest panels read clearly.', v: 'grid' },
  { t: 'Land', d: 'The last panel stops right in front of you.', v: 'blocks' },
];

export default function ExpPerspectiveScene({ config, scrollRoot = null, reducedMotion, className }: SectionProps<ExpPerspectiveSceneConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const track = useRef<HTMLDivElement>(null);
  useScrollVar(track, { scrollRoot, span: 'pinned', disabled: reduced, staticValue: 0 });
  const n = Math.max(3, Math.min(ITEMS.length, Math.round(c.panels)));
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-n': n, '--ff-gap': `${c.spacing}px`, '--ff-persp': `${c.perspective}px`, '--ff-sway': c.sway, '--ff-fog': c.fog, '--ff-len': c.scrollLength,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-exp-perspective-scene ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby="ff-eps-h">
      <div ref={track} className="ff-exp-perspective-scene__track">
        <div className="ff-exp-perspective-scene__stage">
          <h2 id="ff-eps-h" className="ff-exp-perspective-scene__title">Fly through the story</h2>
          <div className="ff-exp-perspective-scene__world" aria-hidden={reduced ? undefined : false}>
            <ol className="ff-exp-perspective-scene__rail">
              {ITEMS.slice(0, n).map((it, i) => (
                <li key={it.t} className="ff-exp-perspective-scene__panel" style={{ '--i': i, '--side': i % 2 ? 1 : -1 } as CSSProperties}>
                  <Art seed={`eps-${i}`} variant={it.v} hue={i * 50 + 220} decorative ratio="16 / 10" className="ff-exp-perspective-scene__art" />
                  <div><b>{String(i + 1).padStart(2, '0')}</b><h3>{it.t}</h3><p>{it.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
