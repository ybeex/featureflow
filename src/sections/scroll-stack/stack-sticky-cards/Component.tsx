import { useRef, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Art } from '../../../ff/Art';
import { FEATURES } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StackStickyCardsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

interface CardProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  scaleStep: number;
  reduced: boolean;
}

function Card({ index, total, progress, scaleStep, reduced }: CardProps) {
  const feature = FEATURES[index % FEATURES.length];
  // Card i starts shrinking once the list has scrolled past its slot, and settles at a
  // smaller scale the more cards have since landed on top of it. The last card stays at 1.
  const target = 1 - (total - 1 - index) * scaleStep;
  const scale = useTransform(progress, [index / total, 1], [1, target]);

  return (
    <li className="ff-stack-sticky-cards__slot" style={{ '--i': index } as CSSProperties}>
      <motion.article className="ff-stack-sticky-cards__card" style={reduced ? undefined : { scale }}>
        <div className="ff-stack-sticky-cards__copy">
          <span className="ff-stack-sticky-cards__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <p className="ff-stack-sticky-cards__kicker">{feature.kicker}</p>
          <h3 className="ff-stack-sticky-cards__title">{feature.title}</h3>
          <p className="ff-stack-sticky-cards__body">{feature.body}</p>
          {feature.stat && <p className="ff-stack-sticky-cards__stat">{feature.stat}</p>}
        </div>
        <Art seed={`stack-${feature.id}`} hue={20 + index * 48} label={`Illustration for ${feature.title}`} ratio="4 / 3" className="ff-stack-sticky-cards__art" />
      </motion.article>
    </li>
  );
}

export default function StackStickyCards({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StackStickyCardsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const listRef = useRef<HTMLOListElement>(null);
  // Motion reads its scroll container from a ref; the host passes the scrolling element (or null for the window).
  const containerRef = useRef<HTMLElement | null>(null);
  containerRef.current = scrollRoot;

  const { scrollYProgress } = useScroll({
    target: listRef,
    container: scrollRoot ? containerRef : undefined,
    offset: ['start start', 'end end'],
  });

  const style = {
    '--ff-bg': c.background,
    '--ff-fg': c.textColor,
    '--ff-accent': c.accent,
    '--ff-radius': `${c.radius}px`,
    '--ff-top': `${c.stickyTop}px`,
    '--ff-offset': `${c.stackOffset}px`,
    '--ff-gap': `${c.gap}px`,
    '--ff-shadow': c.shadow,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-stack-sticky-cards ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby="ff-ssc-heading">
      <header className="ff-stack-sticky-cards__intro">
        <p className="ff-stack-sticky-cards__eyebrow">How Lumen works</p>
        <h2 id="ff-ssc-heading">Four steps from scattered to steady</h2>
        <p>Scroll and each step settles onto the one before it.</p>
      </header>
      <ol className="ff-stack-sticky-cards__list" ref={listRef}>
        {Array.from({ length: c.cardCount }, (_, i) => (
          <Card key={i} index={i} total={c.cardCount} progress={scrollYProgress} scaleStep={c.scaleStep} reduced={reduced} />
        ))}
      </ol>
    </section>
  );
}
