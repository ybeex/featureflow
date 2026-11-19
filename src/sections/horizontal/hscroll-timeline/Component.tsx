import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type HscrollTimelineConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const MILESTONES = [
  { y: '2019', t: 'First prototype', d: 'Two founders and a spreadsheet that refused to stay a spreadsheet.' },
  { y: '2020', t: 'Private beta', d: 'Forty teams, one rule: tell us what annoys you.' },
  { y: '2021', t: 'Public launch', d: 'The queue, the plan and the weekly digest, available to everyone.' },
  { y: '2022', t: 'Automations', d: 'Plain-language rules that preview themselves before they run.' },
  { y: '2023', t: 'SOC 2 Type II', d: 'Audit logs, SSO and field-level permissions for larger teams.' },
  { y: '2024', t: 'Open API', d: 'Typed endpoints and webhooks, versioned and documented.' },
  { y: '2025', t: 'Global regions', d: 'Data residency in the EU, the US and Asia-Pacific.' },
  { y: '2026', t: 'Today', d: 'Twelve thousand teams and a roadmap shaped by all of them.' },
];

export default function HscrollTimeline({ config, scrollRoot = null, reducedMotion, className }: SectionProps<HscrollTimelineConfig>) {
  void scrollRoot;
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(1);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });
  const n = Math.max(3, Math.min(MILESTONES.length, Math.round(c.milestones)));
  const items = MILESTONES.slice(MILESTONES.length - n);

  // One passive scroll listener, throttled with rAF. Layout is measured once per resize, not per event.
  useEffect(() => {
    const el = scroller.current;
    const tr = track.current;
    if (!el || !tr) return;
    let centres: number[] = [];
    let raf = 0;
    const measure = () => { centres = Array.from(tr.querySelectorAll<HTMLElement>('.ff-hscroll-timeline__dot')).map((nd) => nd.offsetLeft + nd.offsetWidth / 2); };
    const update = () => {
      raf = 0;
      const range = Math.max(1, el.scrollWidth - el.clientWidth);
      const p = el.scrollLeft / range;
      const mid = el.scrollLeft + el.clientWidth * (0.25 + 0.5 * p);
      tr.style.setProperty('--ff-fill', `${mid}px`);
      tr.style.setProperty('--ff-progress', p.toFixed(4));
      const count = centres.filter((x) => x <= mid).length;
      setReached((prev) => (prev === count ? prev : count));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure();
    update();
    el.addEventListener('scroll', schedule, { passive: true });
    const ro = new ResizeObserver(() => { measure(); schedule(); });
    ro.observe(el);
    return () => { el.removeEventListener('scroll', schedule); ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [c.spacing, c.cardWidth, n]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!c.dragEnabled || e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = scroller.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d.on || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    drag.current.on = false;
    setDragging(false);
    try { scroller.current?.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };
  // A drag that ends on a card must not count as a click on it.
  const onClickCapture = useCallback((e: React.MouseEvent) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } }, []);
  const onKey = (e: KeyboardEvent) => {
    const el = scroller.current;
    if (!el) return;
    const step = c.spacing;
    if (e.key === 'ArrowRight') { e.preventDefault(); el.scrollBy({ left: step, behavior: reduced ? 'auto' : 'smooth' }); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); el.scrollBy({ left: -step, behavior: reduced ? 'auto' : 'smooth' }); }
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-step': `${c.spacing}px`, '--ff-card': `${c.cardWidth}px`, '--ff-line': `${c.lineThickness}px`, '--ff-n': n,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-hscroll-timeline ${className ?? ''}`} style={style} aria-labelledby={headingId}>
      <header className="ff-hscroll-timeline__head"><p>Our story</p><h2 id={headingId}>Seven years of small, steady steps</h2></header>
      <div
        ref={scroller} className="ff-hscroll-timeline__scroller" data-drag={c.dragEnabled || undefined} data-dragging={dragging || undefined}
        tabIndex={0} role="region" aria-label="Company timeline. Scroll sideways or use the left and right arrow keys."
        onKeyDown={onKey} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onClickCapture={onClickCapture}
      >
        <div ref={track} className="ff-hscroll-timeline__track">
          <div className="ff-hscroll-timeline__rail" aria-hidden="true"><i /></div>
          <ol className="ff-hscroll-timeline__list">
            {items.map((m, i) => (
              <li key={m.y} style={{ '--i': i + 1 } as CSSProperties} data-node data-pos={i % 2 === 0 ? 'up' : 'down'} data-reached={i < reached || undefined}>
                <article className="ff-hscroll-timeline__card">
                  <p className="ff-hscroll-timeline__year">{m.y}{i < reached && <span className="ff-visually-hidden"> (passed)</span>}</p>
                  <h3>{m.t}</h3>
                  <p>{m.d}</p>
                </article>
                <span className="ff-hscroll-timeline__dot" aria-hidden="true">{i < reached && <Check size={11} strokeWidth={3.5} />}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="ff-hscroll-timeline__meter" aria-hidden="true"><i /></div>
    </section>
  );
}
