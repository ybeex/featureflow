import { useEffect, useRef, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type ExpLightBeamConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const NOTES = [
  { t: 'Clarity', d: 'Every line of copy exists in the page at full contrast. The light only changes how loud it is.' },
  { t: 'Focus', d: 'Readers choose where to look and the interface answers with brightness, not with a hover popup.' },
  { t: 'Craft', d: 'One mask, one smoothed position, no canvas and no extra elements following the cursor.' },
];

export default function ExpLightBeam({ config, reducedMotion, paused, className }: SectionProps<ExpLightBeamConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.45, active: false });
  const live = !reduced && !paused;

  // Smooth rAF loop: current position eases toward the pointer, or follows a Lissajous sweep when nobody is pointing.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!live) {
      el.style.setProperty('--bx', '50%');
      el.style.setProperty('--by', '45%');
      return;
    }
    let raf = 0;
    let t0 = performance.now();
    const cur = { x: 0.5, y: 0.45 };
    const tick = (now: number) => {
      const tg = target.current;
      let tx = tg.x;
      let ty = tg.y;
      if (!tg.active) {
        if (!c.autoSweep) {
          tx = 0.5;
          ty = 0.45;
        } else {
          const t = ((now - t0) / 1000) * c.sweepSpeed;
          tx = 0.5 + Math.sin(t * 0.8) * 0.36;
          ty = 0.45 + Math.sin(t * 1.3 + 1) * 0.22;
        }
      }
      const k = Math.min(1, Math.max(0.02, c.smoothing));
      cur.x += (tx - cur.x) * k;
      cur.y += (ty - cur.y) * k;
      el.style.setProperty('--bx', `${(cur.x * 100).toFixed(2)}%`);
      el.style.setProperty('--by', `${(cur.y * 100).toFixed(2)}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, c.autoSweep, c.sweepSpeed, c.smoothing]);

  const onMove = (e: PointerEvent) => {
    if (!live || e.pointerType === 'touch' || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    target.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, active: true };
  };
  const onLeave = () => {
    target.current.active = false;
  };

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-tint': c.tint,
    '--ff-r': `${c.radius}px`,
    '--ff-soft': c.softness,
    '--ff-amb': c.ambient,
  } as CSSProperties;

  return (
    <section ref={root} className={`ff-root ff-exp-light-beam ${className ?? ''}`} style={style} data-live={live || undefined} data-reduced={reduced || undefined} aria-labelledby="ff-elb-h">
      <div ref={stage} className="ff-exp-light-beam__stage" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="ff-exp-light-beam__copy">
          <p>Spotlight reading</p>
          <h2 id="ff-elb-h">{c.headline}</h2>
          <ul>
            {NOTES.map((n) => (
              <li key={n.t}>
                <h3>{n.t}</h3>
                <span>{n.d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ff-exp-light-beam__glow" aria-hidden="true" />
      </div>
    </section>
  );
}
