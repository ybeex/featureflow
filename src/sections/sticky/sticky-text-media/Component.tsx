import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useActiveIndex } from '../../../ff/useActiveIndex';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StickyTextMediaConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

interface Scene {
  kicker: string;
  title: string;
  text: string;
  variant: ArtVariant;
  hue: number;
  alt: string;
}

const SCENES: Scene[] = [
  { kicker: 'Sketch', title: 'Start from a rough shape', text: 'Drop in a few blocks and Lumen proposes a layout, spacing and a type scale. Nothing is final, everything is editable.', variant: 'blocks', hue: 18, alt: 'Overlapping orange and coral rectangles suggesting a rough layout' },
  { kicker: 'Palette', title: 'Colour that holds together', text: 'Pick one accent and the rest of the palette is derived, then checked against contrast targets before you ever see it.', variant: 'dunes', hue: 32, alt: 'Layered sand dunes under a pale sun, shown in warm tones' },
  { kicker: 'Motion', title: 'Movement with a reason', text: 'Transitions are generated from your content hierarchy, so what matters moves first and everything else follows.', variant: 'orbit', hue: 250, alt: 'Concentric orbit lines around a glowing core on a dark background' },
  { kicker: 'Rhythm', title: 'A grid that breathes', text: 'Modules snap to a baseline you can see. Change one column and its neighbours rebalance instead of breaking.', variant: 'grid', hue: 150, alt: 'A grid of softly rotated green tiles with varying opacity' },
  { kicker: 'Depth', title: 'Layers you can read', text: 'Shadows, blur and overlap follow one light source, so depth looks deliberate rather than decorative.', variant: 'peaks', hue: 200, alt: 'Overlapping blue mountain ridges fading into the distance' },
  { kicker: 'Ship', title: 'Hand off without a meeting', text: 'Export tokens, components and a living style guide. Developers get the intent, not just the pixels.', variant: 'waves', hue: 330, alt: 'Dark layered waves in magenta and plum tones' },
];

export default function StickyTextMedia({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StickyTextMediaConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const headingId = `${uid}-h`;
  const listRef = useRef<HTMLOListElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!reduced), [reduced]);

  const count = Math.max(1, Math.min(SCENES.length, Math.round(c.imageCount)));
  const scenes = SCENES.slice(0, count);
  const [rawActive, setActive] = useActiveIndex(listRef, { root: scrollRoot, itemSelector: '[data-step]' });
  const active = Math.min(rawActive, count - 1);
  const scene = scenes[active];

  const jump = (i: number) => {
    setActive(i);
    const el = listRef.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-col': `${c.columnRatio}fr`,
    '--ff-col2': `${100 - c.columnRatio}fr`,
    '--ff-top': `${c.stickyOffset}px`,
    '--ff-gap': `${c.gap}px`,
    '--ff-radius': `${c.radius}px`,
    '--ff-dim': c.dimInactive,
    '--ff-dur': `${c.duration}ms`,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-sticky-text-media ${className ?? ''}`} style={style} data-armed={armed || undefined} aria-labelledby={headingId}>
      <div className="ff-sticky-text-media__inner">
        <div className="ff-sticky-text-media__copy">
          <div className="ff-sticky-text-media__head">
            <p className="ff-sticky-text-media__eyebrow">Lumen Studio</p>
            <h2 id={headingId}>Every great page starts as a picture</h2>
          </div>
          <div className="ff-sticky-text-media__live">
            <p className="ff-sticky-text-media__counter">
              <span>{String(active + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
            </p>
            <p className="ff-sticky-text-media__sub">
              <span key={active} className="ff-sticky-text-media__swap">
                <strong>{scene.kicker}.</strong> {scene.text}
              </span>
            </p>
            <ol className="ff-sticky-text-media__dots" aria-label="Images">
              {scenes.map((s, i) => (
                <li key={s.kicker}>
                  <button type="button" className="ff-sticky-text-media__dot" aria-current={i === active ? 'true' : undefined} aria-label={`Show image ${i + 1} of ${count}: ${s.title}`} onClick={() => jump(i)}>
                    <span />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <ol className="ff-sticky-text-media__media" ref={listRef}>
          {scenes.map((s, i) => (
            <li key={s.kicker} className="ff-sticky-text-media__item" data-step={i} data-active={i === active || undefined}>
              <figure>
                <Art seed={`stm-${s.kicker}`} variant={s.variant} hue={s.hue} label={s.alt} ratio={`${c.imageRatio} / 1`} className="ff-sticky-text-media__art" />
                <figcaption>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <b>{s.title}</b>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
