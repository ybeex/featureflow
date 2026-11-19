import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Pause, Play } from 'lucide-react';
import { MockUI, BrowserFrame, type MockVariant } from '../../../ff/Mock';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type InteractiveTabsIllustrationConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const TABS: { id: string; label: string; title: string; body: string; v: MockVariant }[] = [
  { id: 'plan', label: 'Plan', title: 'Plan in one shared timeline', body: 'Drag work onto a calendar everyone can read. Dependencies are drawn for you and warn when something slips.', v: 'kanban' },
  { id: 'build', label: 'Build', title: 'Keep every decision with its work', body: 'Comments, specs and approvals live on the item itself, so the reason is never separated from the result.', v: 'editor' },
  { id: 'talk', label: 'Talk', title: 'Conversations that stay on topic', body: 'Threads attach to the exact task, so catching up means reading one place instead of five.', v: 'chat' },
  { id: 'measure', label: 'Measure', title: 'Know whether it worked', body: 'Dashboards compare cycle time and handoffs against last quarter, with every figure traced to its records.', v: 'analytics' },
];

export default function InteractiveTabsIllustration({ config, reducedMotion, paused, className }: SectionProps<InteractiveTabsIllustrationConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    const n = (i + TABS.length) % TABS.length;
    setPrev(active);
    setActive(n);
    if (focus) refs.current[n]?.focus();
  };
  const playing = c.autoplay && !reduced && !paused && !userPaused && !hover;
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => select(active + 1), Math.max(2000, c.intervalMs));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active, c.intervalMs]);

  const vertical = c.orientation === 'vertical';
  const onKey = (e: KeyboardEvent) => {
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const back = vertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === next) { e.preventDefault(); select(active + 1, true); }
    else if (e.key === back) { e.preventDefault(); select(active - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    else if (e.key === 'End') { e.preventDefault(); select(TABS.length - 1, true); }
  };
  const dir = active >= prev ? 1 : -1;
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px`, '--ff-dir': dir, '--ff-iv': `${c.intervalMs}ms` } as CSSProperties;
  return (
    <section className={`ff-root ff-interactive-tabs-illustration ${className ?? ''}`} style={style} data-orient={c.orientation} data-fx={c.transition} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} aria-labelledby={`${uid}-h`}>
      <header className="ff-interactive-tabs-illustration__head">
        <h2 id={`${uid}-h`}>One workspace, four ways to work</h2>
        {c.autoplay && !reduced && (
          <button type="button" className="ff-interactive-tabs-illustration__pause" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}>
            {userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        )}
      </header>
      <div className="ff-interactive-tabs-illustration__layout">
        <div role="tablist" aria-label="Features" aria-orientation={c.orientation} className="ff-interactive-tabs-illustration__tabs" onKeyDown={onKey}>
          {TABS.map((t, i) => (
            <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`${uid}-t-${t.id}`} aria-selected={i === active} aria-controls={`${uid}-p-${t.id}`} tabIndex={i === active ? 0 : -1} onClick={() => select(i)}>
              <span>{t.label}</span>
              {i === active && playing && <i className="ff-interactive-tabs-illustration__bar" key={`${active}-bar`} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <div className="ff-interactive-tabs-illustration__panels">
          {TABS.map((t, i) => (
            <div key={t.id} role="tabpanel" id={`${uid}-p-${t.id}`} aria-labelledby={`${uid}-t-${t.id}`} hidden={i !== active} tabIndex={0} className="ff-interactive-tabs-illustration__panel" data-enter={i === active || undefined}>
              <div className="ff-interactive-tabs-illustration__copy"><h3>{t.title}</h3><p>{t.body}</p></div>
              <div className="ff-interactive-tabs-illustration__shot" aria-hidden="true"><BrowserFrame title="app.lumen.example"><MockUI variant={t.v} /></BrowserFrame></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
