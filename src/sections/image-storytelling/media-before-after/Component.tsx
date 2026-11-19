import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { MockUI } from '../../../ff/Mock';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type MediaBeforeAfterConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const clamp = (n: number) => (n < 0 ? 0 : n > 100 ? 100 : n);

const CLUTTER = [
  { text: '14 unread alerts', x: 6, y: 10, r: -3 },
  { text: 'Sync failed. Retry?', x: 58, y: 8, r: 2 },
  { text: 'Cookie settings', x: 40, y: 82, r: -1.5 },
  { text: 'Update available!', x: 70, y: 66, r: 3 },
  { text: '3 overdue', x: 12, y: 58, r: 2 },
];

export default function MediaBeforeAfter({ config, scrollRoot = null, reducedMotion, className }: SectionProps<MediaBeforeAfterConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const headingId = `${uid}-h`;
  const hintId = `${uid}-hint`;

  const stageRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const pointerRef = useRef<number | null>(null);
  const touchedRef = useRef(false);
  const [pos, setPos] = useState(c.startPosition);
  const [dragging, setDragging] = useState(false);
  const [sweeping, setSweeping] = useState(false);

  // Follow the "start position" control while the visitor has not touched the slider.
  useEffect(() => {
    if (!touchedRef.current) setPos(c.startPosition);
  }, [c.startPosition]);

  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);
  const inView = useInView(stageRef, { root: scrollRoot, threshold: 0.6, once: true, disabled: !armed });

  // One-off nudge that shows the divider is movable. Cancelled by any interaction.
  useEffect(() => {
    if (!armed || !inView || !c.introSweep || touchedRef.current) return;
    const timers: number[] = [];
    const start = c.startPosition;
    const away = start > 50 ? start - 16 : start + 16;
    timers.push(window.setTimeout(() => { if (!touchedRef.current) { setSweeping(true); setPos(away); } }, 450));
    timers.push(window.setTimeout(() => { if (!touchedRef.current) setPos(start); }, 1250));
    timers.push(window.setTimeout(() => setSweeping(false), 2000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [armed, inView, c.introSweep, c.startPosition]);

  const fromClientX = useCallback((clientX: number) => {
    const r = rectRef.current;
    if (!r || r.width === 0) return;
    setPos(clamp(((clientX - r.left) / r.width) * 100));
  }, []);

  const touch = () => {
    touchedRef.current = true;
    setSweeping(false);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    touch();
    const stage = stageRef.current;
    if (!stage) return;
    rectRef.current = stage.getBoundingClientRect();
    pointerRef.current = e.pointerId;
    try { stage.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    setDragging(true);
    fromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== e.pointerId) return;
    fromClientX(e.clientX);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== e.pointerId) return;
    pointerRef.current = null;
    setDragging(false);
    try { stageRef.current?.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };

  // Release capture if the section unmounts mid-drag.
  useEffect(() => {
    const stage = stageRef.current;
    return () => {
      if (stage && pointerRef.current !== null) {
        try { stage.releasePointerCapture(pointerRef.current); } catch { /* ignore */ }
      }
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowLeft': case 'ArrowDown': next = pos - 2; break;
      case 'ArrowRight': case 'ArrowUp': next = pos + 2; break;
      case 'PageDown': next = pos - 10; break;
      case 'PageUp': next = pos + 10; break;
      case 'Home': next = 0; break;
      case 'End': next = 100; break;
      default: return;
    }
    e.preventDefault();
    touch();
    setPos(clamp(next));
  };

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-radius': `${c.radius}px`,
    '--ff-ratio': c.aspectRatio,
    '--ff-line': `${c.dividerWidth}px`,
    '--ff-glide': reduced ? '0ms' : sweeping ? '750ms' : `${c.smoothing}ms`,
    '--pos': pos,
  } as CSSProperties;

  const rounded = Math.round(pos);

  return (
    <section className={`ff-root ff-media-before-after ${className ?? ''}`} style={style} aria-labelledby={headingId}>
      <header className="ff-media-before-after__intro">
        <p className="ff-media-before-after__eyebrow">Workspace cleanup</p>
        <h2 id={headingId}>From notification noise to a calm, readable day</h2>
        <p id={hintId}>Drag anywhere on the image, or focus the handle and use the arrow keys.</p>
      </header>

      <div
        ref={stageRef}
        className="ff-media-before-after__stage"
        data-dragging={dragging || undefined}
        data-handle={c.handleStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="ff-media-before-after__layer ff-media-before-after__layer--after">
          <MockUI variant="dashboard" label="After: a clean dashboard with three key numbers, one chart and a short task list" style={{ aspectRatio: 'auto', height: '100%' }} />
        </div>
        <div className="ff-media-before-after__layer ff-media-before-after__layer--before">
          <MockUI variant="dashboard" label="Before: the same dashboard buried under alerts, banners and overdue badges" style={{ aspectRatio: 'auto', height: '100%' }} />
          <div className="ff-media-before-after__clutter" aria-hidden="true">
            {CLUTTER.map((x) => (
              <span key={x.text} style={{ left: `${x.x}%`, top: `${x.y}%`, transform: `rotate(${x.r}deg)` }}>{x.text}</span>
            ))}
          </div>
        </div>

        {c.showLabels && (
          <>
            <span className="ff-media-before-after__label ff-media-before-after__label--before">Before</span>
            <span className="ff-media-before-after__label ff-media-before-after__label--after">After</span>
          </>
        )}

        <div className="ff-media-before-after__divider" aria-hidden="true" />
        <div
          className="ff-media-before-after__handle"
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={`${rounded}% before, ${100 - rounded}% after`}
          aria-describedby={hintId}
          onKeyDown={onKeyDown}
        >
          <span className="ff-media-before-after__grip" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
          </span>
        </div>
      </div>
    </section>
  );
}
