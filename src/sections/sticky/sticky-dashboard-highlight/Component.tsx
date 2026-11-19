import { useId, useRef, type CSSProperties } from 'react';
import { Activity, BarChart3, Gauge, Table2 } from 'lucide-react';
import { useActiveIndex } from '../../../ff/useActiveIndex';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type StickyDashboardHighlightConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const AREAS = ['kpi', 'chart', 'table', 'feed'] as const;
const NARRATIVE = [
  { area: 'kpi', Icon: Gauge, label: 'Health at a glance', title: 'Start with three numbers', text: 'Revenue, active teams and churn are the first thing anyone sees, so the week’s story is clear before a single filter is touched.' },
  { area: 'chart', Icon: BarChart3, label: 'Trend over time', title: 'See direction, not noise', text: 'The trend line smooths daily spikes and marks the moments that changed the slope, like a launch or a pricing update.' },
  { area: 'table', Icon: Table2, label: 'Accounts to watch', title: 'Find the accounts that need you', text: 'The table ranks accounts by risk and expansion potential, with the reason shown beside each score.' },
  { area: 'feed', Icon: Activity, label: 'Live activity', title: 'Follow what just happened', text: 'A running feed ties each change back to the person and the decision behind it, so nothing arrives without context.' },
] as const;

function Tile({ area, focus, label, children, className }: { area: (typeof AREAS)[number]; focus: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`ff-sticky-dashboard-highlight__tile ${className ?? ''}`} data-area={area} data-focus={focus === area || undefined}>
      <span className="ff-sticky-dashboard-highlight__tag">{label}</span>
      {children}
    </div>
  );
}

export default function StickyDashboardHighlight({ config, scrollRoot = null, reducedMotion, className }: SectionProps<StickyDashboardHighlightConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const headingId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const [active] = useActiveIndex(listRef, { root: scrollRoot, rootMargin: '-40% 0px -40% 0px' });
  const focus = NARRATIVE[Math.min(active, NARRATIVE.length - 1)].area;
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-top': `${c.stickyOffset}px`,
    '--ff-dim': c.dim, '--ff-dur': reduced ? '0ms' : `${c.duration}ms`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-sticky-dashboard-highlight ${className ?? ''}`} style={style} data-style={c.highlightStyle} data-callouts={c.showCallouts || undefined} aria-labelledby={headingId}>
      <header className="ff-sticky-dashboard-highlight__head"><p>The dashboard</p><h2 id={headingId}>Every panel has a job</h2></header>
      <div className="ff-sticky-dashboard-highlight__grid">
        <div className="ff-sticky-dashboard-highlight__stage">
          <div className="ff-sticky-dashboard-highlight__board" role="group" aria-label="Illustrated analytics dashboard">
            <Tile area="kpi" focus={focus} label="Key metrics" className="ff-sticky-dashboard-highlight__kpis">
              {[['Revenue', '$48.2k', '+8%'], ['Active teams', '2,914', '+3%'], ['Churn', '1.8%', '-0.4%']].map(([k, v, d]) => (
                <div key={k}><small>{k}</small><b>{v}</b><em>{d}</em></div>
              ))}
            </Tile>
            <Tile area="chart" focus={focus} label="Revenue trend">
              <svg viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 C25 62 40 74 66 52 S110 46 134 34 S190 40 240 12" fill="none" stroke="var(--ff-accent)" strokeWidth="2.5" /><path d="M0 70 C25 62 40 74 66 52 S110 46 134 34 S190 40 240 12 V90 H0Z" fill="var(--ff-accent)" opacity=".12" /></svg>
            </Tile>
            <Tile area="table" focus={focus} label="Accounts">
              {[['Northwind', 'Expand', '92'], ['Globex', 'At risk', '41'], ['Initech', 'Stable', '67']].map(([n, s, sc]) => (
                <p key={n}><span>{n}</span><span>{s}</span><b>{sc}</b></p>
              ))}
            </Tile>
            <Tile area="feed" focus={focus} label="Activity">
              {['Priya approved the Q4 plan', 'Alert cleared on Globex', 'New report shared by Sam'].map((t) => <p key={t}><i aria-hidden="true" />{t}</p>)}
            </Tile>
          </div>
        </div>
        <ol className="ff-sticky-dashboard-highlight__steps" ref={listRef}>
          {NARRATIVE.map(({ Icon, label, title, text }, i) => (
            <li key={title} data-step={i} data-active={i === active || undefined} aria-current={i === active ? 'step' : undefined}>
              <span className="ff-sticky-dashboard-highlight__chip"><Icon size={14} aria-hidden="true" /> {label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
