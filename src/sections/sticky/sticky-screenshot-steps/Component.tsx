import { useId, useRef, type CSSProperties } from 'react';
import { BrowserFrame, MockUI, type MockVariant } from '../../../ff/Mock';
import { useActiveIndex } from '../../../ff/useActiveIndex';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StickyScreenshotStepsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

// Region = where the callout sits on the screenshot, in percent of its width/height.
const STEPS: { variant: MockVariant; title: string; text: string; region: { x: number; y: number; w: number; h: number }; chip: string }[] = [
  { variant: 'dashboard', title: 'Start with the numbers that matter', text: 'Revenue, active users and churn sit at the top of every workspace, so you read the week at a glance.', region: { x: 15, y: 10, w: 80, h: 18 }, chip: 'Key metrics' },
  { variant: 'analytics', title: 'Spot the trend, not just the total', text: 'Bars show momentum across periods while the ring tracks progress to the quarterly goal.', region: { x: 5, y: 12, w: 62, h: 76 }, chip: 'Trend chart' },
  { variant: 'kanban', title: 'Hand work to the right person', text: 'Drag a card between columns and its owner, status and history update everywhere it appears.', region: { x: 36, y: 10, w: 28, h: 55 }, chip: 'In progress' },
  { variant: 'editor', title: 'Keep the reasoning attached', text: 'Notes live beside the work they explain, so the next person sees the why as well as the what.', region: { x: 28, y: 10, w: 68, h: 80 }, chip: 'Linked notes' },
];

export default function StickyScreenshotSteps({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StickyScreenshotStepsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const [active] = useActiveIndex(listRef, { root: scrollRoot, rootMargin: '-40% 0px -40% 0px' });
  const n = Math.max(2, Math.min(STEPS.length, Math.round(c.steps)));
  const idx = Math.min(active, n - 1);
  const r = STEPS[idx].region;
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-top': `${c.stickyOffset}px`,
    '--ff-dur': reduced ? '0ms' : `${c.duration}ms`, '--ff-scale': c.calloutScale,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-sticky-screenshot-steps ${className ?? ''}`} style={style} data-side={c.side} data-callout={c.calloutStyle} aria-labelledby={headingId}>
      <header className="ff-sticky-screenshot-steps__head"><p>Inside the product</p><h2 id={headingId}>Follow one idea from signal to decision</h2></header>
      <div className="ff-sticky-screenshot-steps__grid">
        <div className="ff-sticky-screenshot-steps__stage">
          <div className="ff-sticky-screenshot-steps__shot">
            <BrowserFrame title="lumen.app">
              <div className="ff-sticky-screenshot-steps__layers">
                {STEPS.slice(0, n).map((s, i) => (
                  <div key={s.variant} className="ff-sticky-screenshot-steps__layer" data-on={i === idx || undefined} aria-hidden={i !== idx}>
                    <MockUI variant={s.variant} label={`${s.title}: interface preview`} />
                  </div>
                ))}
              </div>
            </BrowserFrame>
            <div className="ff-sticky-screenshot-steps__callout" aria-hidden="true" style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}>
              <span>{STEPS[idx].chip}</span>
            </div>
          </div>
        </div>
        <ol className="ff-sticky-screenshot-steps__steps" ref={listRef}>
          {STEPS.slice(0, n).map((s, i) => (
            <li key={s.title} data-step={i} data-active={i === idx || undefined} aria-current={i === idx ? 'step' : undefined}>
              <span className="ff-sticky-screenshot-steps__num">Step {i + 1} of {n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
