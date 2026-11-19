import { useId, useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Art } from '../../../ff/Art';
import { BrowserFrame, MockUI, type MockVariant } from '../../../ff/Mock';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StackScreenshotLayersConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const SHOTS: { variant: MockVariant; title: string; text: string; url: string }[] = [
  { variant: 'dashboard', title: 'See the whole picture', text: 'A live overview of revenue, activity and churn, built from the tools you already use.', url: 'lumen.app/overview' },
  { variant: 'analytics', title: 'Ask better questions', text: 'Slice any metric by segment, cohort or time and pin the answer to your dashboard.', url: 'lumen.app/analytics' },
  { variant: 'kanban', title: 'Turn insight into action', text: 'Move findings straight into the board your team already plans on.', url: 'lumen.app/board' },
  { variant: 'editor', title: 'Write it down once', text: 'Decisions, context and owners stay attached to the work, searchable forever.', url: 'lumen.app/docs' },
  { variant: 'chat', title: 'Keep everyone aligned', text: 'Threads link back to the data behind them, so debates start from the same page.', url: 'lumen.app/inbox' },
];

function Shot({ i, n, progress, overlap, tilt, reduced }: { i: number; n: number; progress: MotionValue<number>; overlap: number; tilt: number; reduced: boolean }) {
  const s = SHOTS[i % SHOTS.length];
  // Shot i slides in during its own slice of progress, then settles slightly back as the next one covers it.
  const y = useTransform(progress, [(i - 1) / n, i / n], ['115%', '0%']);
  const settle = useTransform(progress, [i / n, (i + 1) / n], [1, 0.94]);
  const rot = useTransform(progress, [(i - 1) / n, i / n], [tilt, 0]);
  const dim = useTransform(progress, [i / n, (i + 1) / n], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)']);
  const base: CSSProperties = { zIndex: i + 1, top: `${i * overlap}px` };
  return (
    <motion.div className="ff-stack-screenshot-layers__shot" style={reduced ? base : { ...base, y: i === 0 ? 0 : y, scale: settle, rotate: i === 0 ? 0 : rot }}>
      <BrowserFrame title={s.url}><MockUI variant={s.variant} label={`${s.title}: interface preview`} /></BrowserFrame>
      {!reduced && <motion.i className="ff-stack-screenshot-layers__dim" style={{ backgroundColor: dim }} aria-hidden="true" />}
    </motion.div>
  );
}

export default function StackScreenshotLayers({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StackScreenshotLayersConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  containerRef.current = scrollRoot;
  const n = Math.max(2, Math.round(c.screenshotCount));
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, container: scrollRoot ? containerRef : undefined, offset: ['start start', 'end end'] });
  // Scroll progress 0..1 spans n screenshots; each switches at the middle of its slide-in.
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1) * 1.0001)))));
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -c.parallax]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, c.parallax * 0.5]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-len': c.scrollLength } as CSSProperties;
  const cap = SHOTS[(reduced ? 0 : active) % SHOTS.length];

  return (
    <section className={`ff-root ff-stack-screenshot-layers ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby={headingId}>
      <div className="ff-stack-screenshot-layers__track" ref={trackRef}>
        <div className="ff-stack-screenshot-layers__stage">
          {!reduced && (
            <>
              <motion.div className="ff-stack-screenshot-layers__bg" style={{ y: bgY }} aria-hidden="true"><Art seed="layers-bg" variant="dunes" hue={22} decorative ratio="1 / 1" /></motion.div>
              <motion.div className="ff-stack-screenshot-layers__bg ff-stack-screenshot-layers__bg--b" style={{ y: bgY2 }} aria-hidden="true"><Art seed="layers-bg-b" variant="orbit" hue={250} decorative ratio="1 / 1" /></motion.div>
            </>
          )}
          <div className="ff-stack-screenshot-layers__caption" aria-live="polite">
            <p className="ff-stack-screenshot-layers__eyebrow">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
            <h2 id={headingId}>{reduced ? 'From overview to action' : cap.title}</h2>
            <p className="ff-stack-screenshot-layers__text">{reduced ? 'Five screens that carry an idea from insight to follow-through.' : cap.text}</p>
          </div>
          <div className="ff-stack-screenshot-layers__shots">
            {Array.from({ length: n }, (_, i) => <Shot key={i} i={i} n={n} progress={scrollYProgress} overlap={c.overlap} tilt={c.tilt} reduced={reduced} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
