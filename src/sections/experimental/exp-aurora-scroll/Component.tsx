import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type ExpAuroraScrollConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

export default function ExpAuroraScroll({ config, scrollRoot = null, reducedMotion, paused, className }: SectionProps<ExpAuroraScrollConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useScrollVar(track, { scrollRoot, span: 'pinned', disabled: reduced, staticValue: 0.35 });
  const live = !reduced && !paused;

  // Pointer position is a pair of CSS variables on the stage; the blobs read them with a small lerp done by CSS transitions.
  const onMove = (e: PointerEvent) => {
    if (!c.followPointer || !live || e.pointerType === 'touch' || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    stage.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    stage.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const style = { '--ff-h0': c.hueStart, '--ff-ht': c.hueTravel, '--ff-blur': `${c.blur}px`, '--ff-i': c.intensity, '--ff-len': c.scrollLength, '--ff-fg': c.textColor } as CSSProperties;
  return (
    <section className={`ff-root ff-exp-aurora-scroll ${className ?? ''}`} style={style} data-live={live || undefined} data-grain={c.grain || undefined} data-reduced={reduced || undefined} aria-labelledby="ff-eas-h">
      <div ref={track} className="ff-exp-aurora-scroll__track">
        <div ref={stage} className="ff-exp-aurora-scroll__stage" onPointerMove={onMove}>
          <div className="ff-exp-aurora-scroll__sky" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="ff-exp-aurora-scroll__copy">
            <p>Northern signal</p>
            <h2 id="ff-eas-h">The sky changes colour as you scroll</h2>
            <span>Four blurred light sources, one scroll value, no images.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
