import { useId, useRef, type CSSProperties, type MouseEvent } from 'react';
import { Check } from 'lucide-react';
import { Art, type ArtVariant } from '../../../ff/Art';
import { useActiveIndex } from '../../../ff/useActiveIndex';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StickyNavStepsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const STEPS: { id: string; nav: string; title: string; text: string; variant: ArtVariant }[] = [
  { id: 'connect', nav: 'Connect', title: 'Connect your sources', text: 'Authorise the tools you already use. Lumen reads, never rewrites, and shows you exactly what it can see.', variant: 'grid' },
  { id: 'map', nav: 'Map', title: 'Map how work flows', text: 'Review the workflow Lumen inferred from your history, then correct it in a couple of clicks.', variant: 'orbit' },
  { id: 'automate', nav: 'Automate', title: 'Switch on the routines', text: 'Preview each automation against last week’s data before it runs on anything live.', variant: 'waves' },
  { id: 'invite', nav: 'Invite', title: 'Bring the team in', text: 'Roles, spaces and notifications are set once and inherited by everyone who joins.', variant: 'blocks' },
  { id: 'review', nav: 'Review', title: 'Review what changed', text: 'A weekly digest shows time saved, work unblocked and the next thing worth improving.', variant: 'dunes' },
];

export default function StickyNavSteps({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StickyNavStepsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const n = Math.max(3, Math.min(STEPS.length, Math.round(c.steps)));
  const [active, setActive] = useActiveIndex(bodyRef, { root: scrollRoot, rootMargin: '-35% 0px -55% 0px' });
  useScrollVar(bodyRef, { scrollRoot, span: 'pinned', disabled: reduced, staticValue: 1 });
  const idx = Math.min(active, n - 1);

  const go = (e: MouseEvent, i: number) => {
    e.preventDefault();
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
    if (!el) return;
    const behavior: ScrollBehavior = reduced || c.scrollBehavior === 'instant' ? 'auto' : 'smooth';
    if (scrollRoot) {
      const top = el.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top + scrollRoot.scrollTop - c.stickyOffset - 56;
      scrollRoot.scrollTo({ top, behavior });
    } else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - c.stickyOffset - 56, behavior });
    }
    setActive(i);
    el.focus({ preventScroll: true });
  };

  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-top': `${c.stickyOffset}px`,
  } as CSSProperties;
  return (
    <section ref={rootRef} className={`ff-root ff-sticky-nav-steps ${className ?? ''}`} style={style} data-side={c.navSide} data-progress={c.progressStyle} aria-labelledby={`${uid}-h`}>
      <div className="ff-sticky-nav-steps__body" ref={bodyRef}>
        <nav className="ff-sticky-nav-steps__nav" aria-label="Setup steps">
          <ol>
            {STEPS.slice(0, n).map((s, i) => (
              <li key={s.id}>
                <a href={`#${uid}-${s.id}`} aria-current={i === idx ? 'step' : undefined} data-done={i < idx || undefined} onClick={(e) => go(e, i)}>
                  <span className="ff-sticky-nav-steps__dot" aria-hidden="true">{i < idx ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
                  <span>{s.nav}<span className="ff-visually-hidden">{i < idx ? ' (done)' : i === idx ? ' (current)' : ''}</span></span>
                </a>
              </li>
            ))}
          </ol>
          {c.progressStyle !== 'none' && <div className="ff-sticky-nav-steps__progress" aria-hidden="true"><i /></div>}
        </nav>
        <div className="ff-sticky-nav-steps__steps">
          <h2 id={`${uid}-h`} className="ff-sticky-nav-steps__title">Up and running in five steps</h2>
          {STEPS.slice(0, n).map((s, i) => (
            <article key={s.id} id={`${uid}-${s.id}`} tabIndex={-1} data-step={i} className="ff-sticky-nav-steps__step">
              <Art seed={`nav-${s.id}`} variant={s.variant} hue={i * 60 + 200} ratio="16 / 8" label={`${s.title}: illustration`} className="ff-sticky-nav-steps__art" />
              <p className="ff-sticky-nav-steps__k">Step {i + 1}</p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
