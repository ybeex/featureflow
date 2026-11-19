import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TypeKineticMarqueeConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const WORDS = [
  ['Plan', 'Build', 'Ship', 'Learn'],
  ['Faster', 'Calmer', 'Clearer', 'Together'],
  ['No meetings', 'No chasing', 'No surprises', 'No silos'],
  ['Design', 'Review', 'Launch', 'Repeat'],
];

export default function TypeKineticMarquee({ config, scrollRoot = null, reducedMotion, paused, className }: SectionProps<TypeKineticMarqueeConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const rowsRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const n = Math.max(1, Math.min(WORDS.length, Math.round(c.rows)));
  const live = !reduced && !paused;

  useEffect(() => {
    const root = rowsRef.current;
    if (!root || !live) return;
    const tracks = Array.from(root.querySelectorAll<HTMLElement>('[data-track]'));
    const offsets = tracks.map(() => 0);
    const widths = tracks.map(() => 1);
    const measure = () => tracks.forEach((t, i) => { widths[i] = (t.scrollWidth / 2) || 1; });
    measure();
    const ro = new ResizeObserver(measure);
    tracks.forEach((t) => ro.observe(t));

    // Scroll velocity (px per frame, smoothed) adds to the base speed, so scrolling "pushes" the text.
    const scroller: HTMLElement | Window = scrollRoot ?? window;
    const pos = () => (scrollRoot ? scrollRoot.scrollTop : window.scrollY);
    let last = pos();
    let vel = 0;
    let t0 = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver((es) => { visible = es[0]?.isIntersecting ?? true; }, { root: scrollRoot });
    io.observe(root);
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      if (!visible) return;
      const p = pos();
      vel += ((p - last) - vel) * 0.12;
      last = p;
      const slow = c.pauseOnHover && hovering.current ? 0 : 1;
      tracks.forEach((t, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const v = (c.speed * slow + Math.abs(vel) * c.scrollBoost * 60) * dt;
        offsets[i] = (offsets[i] + dir * v) % widths[i];
        // Keep the track in the range [-w, 0] so the duplicate half always covers the visible area.
        const o = offsets[i] > 0 ? offsets[i] - widths[i] : offsets[i];
        t.style.transform = `translate3d(${o}px, 0, 0)`;
      });
    };
    raf = requestAnimationFrame(tick);
    void scroller;
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [live, scrollRoot, c.speed, c.scrollBoost, c.pauseOnHover]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-size': `${c.fontSize}px`, '--ff-fs': c.fontSize, '--ff-skew': `${c.skew}deg` } as CSSProperties;
  return (
    <section className={`ff-root ff-type-kinetic-marquee ${className ?? ''}`} style={style} data-ghost={c.ghost || undefined} data-static={!live || undefined} aria-labelledby="ff-tkm-h">
      <h2 id="ff-tkm-h" className="ff-visually-hidden">Plan, build, ship, learn</h2>
      <div ref={rowsRef} className="ff-type-kinetic-marquee__rows" onPointerEnter={() => { hovering.current = true; }} onPointerLeave={() => { hovering.current = false; }}>
        {WORDS.slice(0, n).map((row, r) => (
          <div key={r} className="ff-type-kinetic-marquee__row" data-alt={r % 2 === 1 || undefined} aria-hidden={r > 0 || undefined}>
            <div className="ff-type-kinetic-marquee__track" data-track>
              {[0, 1].map((copy) => (
                <span key={copy} className="ff-type-kinetic-marquee__set" aria-hidden={copy === 1 || undefined}>
                  {row.map((w, i) => <span key={w} className="ff-type-kinetic-marquee__word" data-hl={(i + r) % 3 === 0 || undefined}>{w}<i aria-hidden="true">✦</i></span>)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
