import { useId, useState, type CSSProperties } from 'react';
import { Check, Minus } from 'lucide-react';
import type { SectionProps } from '../../../ff/types';
import { defaults, type CompareMatrixConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

type Cell = boolean | string;
const PLANS = [{ id: 'free', name: 'Free', price: '$0' }, { id: 'pro', name: 'Pro', price: '$12' }, { id: 'team', name: 'Team', price: '$29' }] as const;
const GROUPS: { name: string; rows: { label: string; v: [Cell, Cell, Cell] }[] }[] = [
  { name: 'Workspace', rows: [
    { label: 'Projects', v: ['3', 'Unlimited', 'Unlimited'] },
    { label: 'Version history', v: ['7 days', '90 days', 'Unlimited'] },
    { label: 'Custom fields', v: [false, true, true] },
  ] },
  { name: 'Automation', rows: [
    { label: 'Rules', v: ['5', '100', '1,000'] },
    { label: 'Dry-run previews', v: [true, true, true] },
    { label: 'API access', v: [false, true, true] },
  ] },
  { name: 'Security', rows: [
    { label: 'Two-factor sign-in', v: [true, true, true] },
    { label: 'SSO (SAML)', v: [false, false, true] },
    { label: 'Audit log', v: [false, false, true] },
  ] },
];

export default function CompareMatrix({ config, className }: SectionProps<CompareMatrixConfig>) {
  const c = { ...defaults, ...config };
  const id = useId();
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const hi = PLANS.findIndex((p) => p.id === c.highlight);
  const groups = GROUPS.map((g) => ({ ...g, rows: g.rows.filter((r) => !c.differencesOnly || new Set(r.v.map(String)).size > 1) })).filter((g) => g.rows.length > 0);
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px` } as CSSProperties;
  const show = (v: Cell) => v === true ? <><Check size={18} strokeWidth={2.6} aria-hidden="true" /><span className="ff-visually-hidden">Included</span></> : v === false ? <><Minus size={18} aria-hidden="true" /><span className="ff-visually-hidden">Not included</span></> : v;
  return (
    <section className={`ff-root ff-compare-matrix ${className ?? ''}`} style={style} data-density={c.density} data-sticky={c.stickyHeader || undefined} data-hover={c.rowHover || undefined} aria-labelledby={`${id}-h`}>
      <header className="ff-compare-matrix__head"><h2 id={`${id}-h`}>Compare plans</h2><p>{c.differencesOnly ? 'Showing only the rows that differ.' : 'Everything each plan includes.'}</p></header>
      <div className="ff-compare-matrix__scroll" tabIndex={0} role="region" aria-label="Plan comparison table, scrolls sideways on narrow screens">
        <table>
          <caption className="ff-visually-hidden">Feature comparison of the Free, Pro and Team plans</caption>
          <thead>
            <tr>
              <td />
              {PLANS.map((p, i) => (
                <th key={p.id} scope="col" data-hi={i === hi || undefined} data-col={hoverCol === i || undefined} onPointerEnter={() => setHoverCol(i)} onPointerLeave={() => setHoverCol(null)}>
                  {i === hi && <span className="ff-compare-matrix__tag">Recommended</span>}
                  <span className="ff-compare-matrix__plan">{p.name}</span>
                  <span className="ff-compare-matrix__price">{p.price}<small>/mo</small></span>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.name}>
              <tr className="ff-compare-matrix__group"><th colSpan={4} scope="colgroup">{g.name}</th></tr>
              {g.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.v.map((v, i) => <td key={i} data-hi={i === hi || undefined} data-col={hoverCol === i || undefined} onPointerEnter={() => setHoverCol(i)} onPointerLeave={() => setHoverCol(null)} data-off={v === false || undefined}>{show(v)}</td>)}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        {groups.length === 0 && <p className="ff-compare-matrix__empty">These plans have no differing rows.</p>}
      </div>
    </section>
  );
}
