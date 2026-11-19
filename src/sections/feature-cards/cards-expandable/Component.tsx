import { useEffect, useId, useState, type CSSProperties } from 'react';
import { Plus, Inbox, CalendarClock, GitPullRequest, BarChart3, Lock, Plug } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type CardsExpandableConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const ITEMS = [
  { icon: Inbox, t: 'One inbox for requests', s: 'Everything asked of your team, deduplicated.', d: 'Requests from chat, email and forms land in a single queue. Duplicates merge automatically, and each item carries its source so nobody has to ask where it came from.' },
  { icon: CalendarClock, t: 'Plans that move together', s: 'A slipped date updates every dependency.', d: 'When one milestone moves, every dependent plan shifts with it and the owners are told once, with the reason. No more checking five spreadsheets before a Friday review.' },
  { icon: GitPullRequest, t: 'Reviews with context', s: 'Comments live on the exact line.', d: 'Feedback attaches to the line or frame it is about, can be assigned, and resolves with a click. The thread stays attached to the decision for whoever asks why later.' },
  { icon: BarChart3, t: 'Reports that answer back', s: 'Ask in a sentence, pin the chart.', d: 'Type a question and get a chart you can pin, share or schedule into a weekly digest. Every number links back to the records behind it.' },
  { icon: Lock, t: 'Permissions that make sense', s: 'Roles that mirror your org chart.', d: 'Define access once by role and field. An audit table shows who can see what, and every change is logged with who made it and when.' },
  { icon: Plug, t: 'An API that gets out of the way', s: 'Typed, versioned, documented.', d: 'Everything in the product is available over REST and webhooks, with typed SDKs and a sandbox that mirrors production so tests do not touch real data.' },
];

export default function CardsExpandable({ config, reducedMotion, className }: SectionProps<CardsExpandableConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const [open, setOpen] = useState<number[]>(c.startOpen ? [0] : []);
  // Switching to single mode collapses extras so state never contradicts the setting.
  useEffect(() => { if (c.mode === 'single') setOpen((o) => o.slice(0, 1)); }, [c.mode]);
  useEffect(() => { setOpen(c.startOpen ? [0] : []); }, [c.startOpen]);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : c.mode === 'single' ? [i] : [...o, i]));
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-cols': c.columns, '--ff-dur': reduced ? '0ms' : `${c.duration}ms`, '--ff-radius': `${c.radius}px`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-cards-expandable ${className ?? ''}`} style={style} data-icons={c.showIcons || undefined} aria-labelledby={`${uid}-h`}>
      <header className="ff-cards-expandable__head"><h2 id={`${uid}-h`}>What is inside</h2><p>{c.mode === 'single' ? 'Open one at a time.' : 'Open as many as you like.'}</p></header>
      <ul className="ff-cards-expandable__grid">
        {ITEMS.map((it, i) => {
          const isOpen = open.includes(i);
          return (
            <li key={it.t} className="ff-cards-expandable__card" data-open={isOpen || undefined}>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={`${uid}-p${i}`} id={`${uid}-b${i}`} onClick={() => toggle(i)}>
                  {c.showIcons && <it.icon size={22} className="ff-cards-expandable__icon" aria-hidden="true" />}
                  <span className="ff-cards-expandable__titles"><span>{it.t}</span><small>{it.s}</small></span>
                  <Plus size={20} className="ff-cards-expandable__plus" aria-hidden="true" />
                </button>
              </h3>
              <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="ff-cards-expandable__panel">
                <div><p>{it.d}</p></div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
