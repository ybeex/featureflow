import { useId, useRef, type CSSProperties } from 'react';
import { BarChart3, Link2, ShieldCheck, Sparkles, Users, Workflow } from 'lucide-react';
import { FEATURES } from '../../../ff/sample';
import { useActiveIndex } from '../../../ff/useActiveIndex';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StackNumberedStepsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ICONS = [Link2, Sparkles, Workflow, Users, BarChart3, ShieldCheck];

export default function StackNumberedSteps({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StackNumberedStepsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  useScrollVar(wrapRef, { scrollRoot, span: 'pinned', disabled: reduced });
  const [active] = useActiveIndex(listRef, { root: scrollRoot, itemSelector: '[data-step]', rootMargin: '-35% 0px -35% 0px', disabled: reduced });
  const total = Math.max(2, Math.round(c.steps));

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent,
    '--ff-top': `${c.stickyOffset}px`, '--ff-h': `${c.cardHeight}`, '--ff-offset': `${c.stackOffset}px`, '--ff-radius': `${c.radius}px`,
  } as CSSProperties;

  return (
    <section className={`ff-root ff-stack-numbered-steps ${className ?? ''}`} style={style} data-reduced={reduced || undefined} data-rail={c.showRail || undefined} aria-labelledby={headingId}>
      <header className="ff-stack-numbered-steps__head">
        <p className="ff-stack-numbered-steps__eyebrow">The playbook</p>
        <h2 id={headingId}>Five moves, in order</h2>
      </header>
      <div className="ff-stack-numbered-steps__wrap" ref={wrapRef}>
        {c.showRail && (
          <aside className="ff-stack-numbered-steps__rail" aria-label="Progress">
            <p className="ff-stack-numbered-steps__count"><span className="ff-visually-hidden">Current: </span>Step {Math.min(active + 1, total)} of {total}</p>
            <div className="ff-stack-numbered-steps__track" aria-hidden="true"><i /></div>
            <ol className="ff-stack-numbered-steps__names">
              {Array.from({ length: total }, (_, i) => (
                <li key={i} aria-current={i === active ? 'step' : undefined} data-active={i === active || undefined}>{FEATURES[i % FEATURES.length].kicker}</li>
              ))}
            </ol>
          </aside>
        )}
        <ol className="ff-stack-numbered-steps__list" ref={listRef}>
          {Array.from({ length: total }, (_, i) => {
            const f = FEATURES[i % FEATURES.length];
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={i} className="ff-stack-numbered-steps__slot" data-step={i} style={{ '--i': i, '--behind': Math.max(0, i < active ? active - i : 0) } as CSSProperties}>
                <article className="ff-stack-numbered-steps__card" style={{ '--s': 1 - Math.max(0, active - i) * c.scaleStep } as CSSProperties}>
                  <span className="ff-stack-numbered-steps__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="ff-stack-numbered-steps__body">
                    <span className="ff-stack-numbered-steps__icon"><Icon size={22} aria-hidden="true" /></span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                    {f.stat && <strong>{f.stat}</strong>}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
