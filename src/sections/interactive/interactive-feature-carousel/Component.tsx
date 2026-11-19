import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type InteractiveFeatureCarouselConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const V: ArtVariant[] = ['orbit', 'waves', 'dunes', 'peaks', 'grid', 'blocks'];

export default function InteractiveFeatureCarousel({ config, reducedMotion, paused, className }: SectionProps<InteractiveFeatureCarouselConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const n = FEATURES.length;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const drag = useRef<{ x: number; id: number } | null>(null);

  const go = (i: number) => setIndex(c.loop ? (i + n) % n : Math.max(0, Math.min(n - 1, i)));
  const playing = c.autoplay && !reduced && !paused && !userPaused && !hover && drag.current === null;
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => go(index + 1), Math.max(2000, c.intervalMs));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, c.intervalMs, c.loop]);

  const onDown = (e: PointerEvent) => { if (e.pointerType === 'mouse' && e.button !== 0) return; drag.current = { x: e.clientX, id: e.pointerId }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => { if (drag.current) setDragDx(e.clientX - drag.current.x); };
  const onUp = (e: PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    setDragDx(0);
    const w = (e.currentTarget as HTMLElement).clientWidth * (c.cardWidth / 100);
    if (Math.abs(dx) > Math.min(80, w * 0.2)) go(index + (dx < 0 ? 1 : -1));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(n - 1); }
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-side-scale': c.sideScale, '--ff-side-op': c.sideOpacity, '--ff-w': `${c.cardWidth}%`, '--ff-radius': `${c.radius}px`,
    '--ff-index': index, '--ff-drag': `${dragDx}px`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-interactive-feature-carousel ${className ?? ''}`} style={style} data-drag={dragDx !== 0 || undefined} data-still={reduced || undefined} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} aria-roledescription="carousel" aria-labelledby={`${uid}-h`}>
      <header className="ff-interactive-feature-carousel__head">
        <h2 id={`${uid}-h`}>Six reasons teams stay</h2>
        <div className="ff-interactive-feature-carousel__ctrl">
          {c.autoplay && !reduced && <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Start automatic rotation' : 'Pause automatic rotation'}>{userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>}
          <button type="button" onClick={() => go(index - 1)} disabled={!c.loop && index === 0} aria-label="Previous slide"><ChevronLeft size={18} aria-hidden="true" /></button>
          <button type="button" onClick={() => go(index + 1)} disabled={!c.loop && index === n - 1} aria-label="Next slide"><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      </header>
      <div className="ff-interactive-feature-carousel__viewport" tabIndex={0} role="group" aria-label="Feature slides. Use the arrow keys, or swipe." onKeyDown={onKey} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <ul className="ff-interactive-feature-carousel__track" aria-live={playing ? 'off' : 'polite'}>
          {FEATURES.map((f, i) => {
            let off = i - index;
            if (c.loop) { if (off > n / 2) off -= n; else if (off < -n / 2) off += n; }
            const near = Math.abs(off) <= 1;
            return (
              <li key={f.id} className="ff-interactive-feature-carousel__slide" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`} aria-hidden={off === 0 ? undefined : true} data-active={off === 0 || undefined} data-near={near || undefined} style={{ '--off': off } as CSSProperties}>
                <Art seed={`ifc-${i}`} variant={V[i % V.length]} hue={i * 52 + 30} decorative ratio="16 / 9" className="ff-interactive-feature-carousel__art" />
                <div className="ff-interactive-feature-carousel__copy"><p>{f.kicker}</p><h3>{f.title}</h3><span>{f.body}</span></div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="ff-interactive-feature-carousel__dots" role="group" aria-label="Choose a slide">
        {FEATURES.map((f, i) => <button key={f.id} type="button" onClick={() => go(i)} aria-label={`Slide ${i + 1}: ${f.kicker}`} aria-current={i === index ? 'true' : undefined} />)}
      </div>
    </section>
  );
}
