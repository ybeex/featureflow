import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type InteractiveProductStatesConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

type State = 'empty' | 'loading' | 'ready' | 'error';
const STATES: { id: State; label: string; note: string }[] = [
  { id: 'empty', label: 'Empty', note: 'Say what this space is for and offer the one next step. Never show a bare blank table.' },
  { id: 'loading', label: 'Loading', note: 'Skeletons keep the layout the same size as the data, so nothing jumps when it arrives.' },
  { id: 'ready', label: 'Ready', note: 'The happy path: data, status at a glance, and quick actions on each row.' },
  { id: 'error', label: 'Error', note: 'Explain what failed in plain words, keep the user’s work, and offer a retry.' },
];
const ROWS = [
  { n: 'Q4 launch plan', o: 'Amara', s: 'On track' },
  { n: 'Billing migration', o: 'Tomás', s: 'At risk' },
  { n: 'Onboarding revamp', o: 'Priya', s: 'On track' },
  { n: 'SOC 2 evidence', o: 'Jonas', s: 'Blocked' },
  { n: 'Partner API beta', o: 'Lena', s: 'On track' },
  { n: 'Mobile offline mode', o: 'Kofi', s: 'Planned' },
];

export default function InteractiveProductStates({ config, reducedMotion, className }: SectionProps<InteractiveProductStatesConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const [state, setState] = useState<State>(c.initial);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => setState(c.initial), [c.initial]);

  // "Simulate a load" demonstrates the real transition: loading → ready.
  const simulate = () => {
    window.clearTimeout(timer.current);
    setState('loading');
    timer.current = window.setTimeout(() => setState('ready'), reduced ? 400 : Math.max(400, c.loadMs));
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const rows = ROWS.slice(0, Math.max(2, Math.min(ROWS.length, Math.round(c.rows))));
  const cur = STATES.find((s) => s.id === state)!;
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px` } as CSSProperties;
  return (
    <section className={`ff-root ff-interactive-product-states ${className ?? ''}`} style={style} data-theme={c.theme} aria-labelledby={`${uid}-h`}>
      <header className="ff-interactive-product-states__head">
        <h2 id={`${uid}-h`}>Design every state, not just the happy one</h2>
        <div role="group" aria-label="Interface state" className="ff-interactive-product-states__seg">
          {STATES.map((s) => <button key={s.id} type="button" aria-pressed={state === s.id} onClick={() => { window.clearTimeout(timer.current); setState(s.id); }}>{s.label}</button>)}
        </div>
      </header>
      <div className="ff-interactive-product-states__stage">
        <div className="ff-interactive-product-states__app" aria-busy={state === 'loading'}>
          <div className="ff-interactive-product-states__bar"><b>Projects</b><button type="button" onClick={simulate}><RefreshCw size={14} aria-hidden="true" /> Simulate load</button></div>
          <div className="ff-interactive-product-states__content" data-state={state}>
            {state === 'empty' && (
              <div className="ff-interactive-product-states__center"><Inbox size={34} aria-hidden="true" /><h3>No projects yet</h3><p>Create a project to plan work, assign owners and track progress.</p><button type="button" className="ff-interactive-product-states__cta">New project</button></div>
            )}
            {state === 'loading' && (
              <ul className="ff-interactive-product-states__list" aria-label="Loading projects">{rows.map((r) => <li key={r.n} className="is-skel"><i /><i /><i /></li>)}</ul>
            )}
            {state === 'ready' && (
              <ul className="ff-interactive-product-states__list">{rows.map((r) => <li key={r.n}><span>{r.n}</span><span>{r.o}</span><em data-s={r.s}>{r.s}</em></li>)}</ul>
            )}
            {state === 'error' && (
              <div className="ff-interactive-product-states__center" role="alert"><AlertTriangle size={34} aria-hidden="true" /><h3>Couldn’t load projects</h3><p>We lost the connection to the server. Your changes are saved locally.</p><button type="button" className="ff-interactive-product-states__cta" onClick={simulate}>Try again</button></div>
            )}
          </div>
        </div>
        {c.annotate && <p className="ff-interactive-product-states__note" aria-live="polite"><strong>{cur.label}.</strong> {cur.note}</p>}
      </div>
    </section>
  );
}
