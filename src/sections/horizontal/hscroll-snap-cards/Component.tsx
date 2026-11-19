import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type HscrollSnapCardsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const CARDS: { t: string; d: string; v: ArtVariant }[] = [
  { t: 'Inbox zero for requests', d: 'Everything asked of your team lands in one queue, deduplicated and ranked.', v: 'blocks' },
  { t: 'Plans that update themselves', d: 'When a date slips, every dependent plan moves with it and tells the owner.', v: 'waves' },
  { t: 'Reviews without the ping-pong', d: 'Comments attach to the exact line and resolve with a single click.', v: 'grid' },
  { t: 'Reports on a schedule', d: 'Pin any answer and receive it weekly, in the channel where the team already is.', v: 'dunes' },
  { t: 'Permissions that make sense', d: 'Roles mirror your org chart and can be audited in a single table.', v: 'orbit' },
  { t: 'An API that gets out of the way', d: 'Everything in the app is available over a typed, versioned REST and webhook API.', v: 'peaks' },
  { t: 'Templates from real teams', d: 'Start from a workflow that already runs inside a company like yours.', v: 'blocks' },
];

export default function HscrollSnapCards({ config, scrollRoot = null, reducedMotion, className }: SectionProps<HscrollSnapCardsConfig>) {
  void scrollRoot;
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const scroller = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => CARDS.map((_, i) => i === 0));

  useEffect(() => {
    const root = scroller.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
    const io = new IntersectionObserver((entries) => {
      setVisible((prev) => {
        const next = prev.slice();
        for (const e of entries) next[slides.indexOf(e.target as HTMLElement)] = e.intersectionRatio >= 0.6;
        return next.every((v, i) => v === prev[i]) ? prev : next;
      });
    }, { root, threshold: [0, 0.6, 1] });
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [c.cardWidth, c.gap]);

  const first = visible.indexOf(true);
  const active = first < 0 ? 0 : first;
  const atStart = visible[0];
  const atEnd = visible[CARDS.length - 1];

  const by = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (c.cardWidth + c.gap), behavior: reduced ? 'auto' : 'smooth' });
  }, [c.cardWidth, c.gap, reduced]);

  const goTo = (i: number) => {
    const el = scroller.current;
    const slide = el?.querySelectorAll<HTMLElement>('[data-slide]')[i];
    if (!el || !slide) return;
    el.scrollTo({ left: slide.offsetLeft - (c.snapAlign === 'center' ? (el.clientWidth - slide.clientWidth) / 2 : c.inset), behavior: reduced ? 'auto' : 'smooth' });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); by(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); by(-1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(CARDS.length - 1); }
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-w': `${c.cardWidth}px`, '--ff-gap': `${c.gap}px`,
    '--ff-inset': `${c.inset}px`, '--ff-radius': `${c.radius}px`, '--ff-align': c.snapAlign,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-hscroll-snap-cards ${className ?? ''}`} style={style} aria-roledescription="carousel" aria-labelledby={headingId}>
      <header className="ff-hscroll-snap-cards__head">
        <div><p>What teams use most</p><h2 id={headingId}>Seven things that save the day</h2></div>
        <div className="ff-hscroll-snap-cards__btns">
          <button type="button" onClick={() => by(-1)} disabled={atStart} aria-label="Previous cards"><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" onClick={() => by(1)} disabled={atEnd} aria-label="Next cards"><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </header>
      <div className="ff-hscroll-snap-cards__wrap" data-start={atStart || undefined} data-end={atEnd || undefined}>
        <div ref={scroller} className="ff-hscroll-snap-cards__scroller" tabIndex={0} role="group" aria-label="Feature cards. Use the arrow keys to move between cards." onKeyDown={onKey}>
          {CARDS.map((card, i) => (
            <article key={card.t} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${CARDS.length}`} className="ff-hscroll-snap-cards__card">
              <Art seed={`snap-${i}`} variant={card.v} hue={i * 47 + 220} ratio="4 / 3" label={`${card.t}: illustration`} className="ff-hscroll-snap-cards__art" />
              <h3>{card.t}</h3>
              <p>{card.d}</p>
            </article>
          ))}
        </div>
      </div>
      {c.showDots && (
        <div className="ff-hscroll-snap-cards__dots" role="group" aria-label="Choose a card">
          {CARDS.map((card, i) => (
            <button key={card.t} type="button" onClick={() => goTo(i)} aria-label={`Go to card ${i + 1}: ${card.t}`} aria-current={i === active ? 'true' : undefined} />
          ))}
        </div>
      )}
    </section>
  );
}
