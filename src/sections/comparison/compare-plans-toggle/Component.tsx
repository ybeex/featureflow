import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type ComparePlansToggleConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const PLANS = [
  { id: 'starter', name: 'Starter', monthly: 12, blurb: 'For individuals and tiny teams.', items: ['3 projects', 'Basic automations', 'Community support'] },
  { id: 'growth', name: 'Growth', monthly: 39, blurb: 'For teams that ship every week.', items: ['Unlimited projects', '100 automations', 'Priority support', 'Roles and permissions'] },
  { id: 'scale', name: 'Scale', monthly: 99, blurb: 'For organisations with security needs.', items: ['Everything in Growth', 'SSO and audit log', 'Data residency', 'Dedicated manager'] },
] as const;

/** Eases a displayed number toward a target. Disabled = jumps. */
function useTween(target: number, enabled: boolean) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (!enabled) { setV(target); from.current = target; return; }
    const start = from.current;
    if (start === target) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 420);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = start + (target - start) * e;
      from.current = cur;
      setV(cur);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled]);
  return Math.round(v);
}

function Price({ value, currency, animate }: { value: number; currency: string; animate: boolean }) {
  const shown = useTween(value, animate);
  return <span className="ff-compare-plans-toggle__amount"><span aria-hidden="true">{currency}{shown}</span><span className="ff-visually-hidden">{currency}{value} per month</span></span>;
}

export default function ComparePlansToggle({ config, reducedMotion, className }: SectionProps<ComparePlansToggleConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const labelId = useId();
  const [yearly, setYearly] = useState(c.billing === 'yearly');
  useEffect(() => setYearly(c.billing === 'yearly'), [c.billing]);
  const k = 1 - Math.max(0, Math.min(60, c.yearlyDiscount)) / 100;
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px` } as CSSProperties;
  return (
    <section className={`ff-root ff-compare-plans-toggle ${className ?? ''}`} style={style} aria-labelledby={`${labelId}-h`}>
      <header className="ff-compare-plans-toggle__head">
        <h2 id={`${labelId}-h`}>Simple pricing that scales with you</h2>
        <div className="ff-compare-plans-toggle__switch">
          <span id={labelId} className={yearly ? '' : 'is-on'}>Monthly</span>
          <button type="button" role="switch" aria-checked={yearly} aria-labelledby={labelId} aria-describedby={`${labelId}-d`} onClick={() => setYearly((y) => !y)}><i /></button>
          <span className={yearly ? 'is-on' : ''} aria-hidden="true">Yearly</span>
          <small id={`${labelId}-d`} className="ff-compare-plans-toggle__save">{yearly ? `Yearly billing, you save ${c.yearlyDiscount}%` : `Switch to yearly and save ${c.yearlyDiscount}%`}</small>
        </div>
      </header>
      <ul className="ff-compare-plans-toggle__grid">
        {PLANS.map((p) => {
          const per = yearly ? Math.round(p.monthly * k) : p.monthly;
          const isF = p.id === c.featured;
          return (
            <li key={p.id} className="ff-compare-plans-toggle__plan" data-featured={isF || undefined}>
              {isF && <span className="ff-compare-plans-toggle__badge">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="ff-compare-plans-toggle__blurb">{p.blurb}</p>
              <p className="ff-compare-plans-toggle__price"><Price value={per} currency={c.currency} animate={c.animatePrice && !reduced} /><small>/ month{yearly ? `, billed ${c.currency}${per * 12} yearly` : ''}</small></p>
              <ul>{p.items.map((it) => <li key={it}><Check size={16} aria-hidden="true" />{it}</li>)}</ul>
              <button type="button" className="ff-compare-plans-toggle__cta">Choose {p.name}</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
