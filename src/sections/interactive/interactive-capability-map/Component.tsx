import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { SectionProps } from '../../../ff/types';
import { defaults, type InteractiveCapabilityMapConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

type Group = 'build' | 'run' | 'secure';
interface Node { id: string; label: string; group: Group; d: string; links: string[] }
const NODES: Node[] = [
  { id: 'api', label: 'API', group: 'build', d: 'Typed REST and webhooks for everything in the product, versioned and documented.', links: ['sdk', 'events'] },
  { id: 'sdk', label: 'SDKs', group: 'build', d: 'Generated clients for TypeScript, Python and Go that track the API automatically.', links: ['api'] },
  { id: 'auto', label: 'Automations', group: 'build', d: 'Plain-language rules with a dry run that shows what would have happened last week.', links: ['events', 'queue'] },
  { id: 'events', label: 'Event bus', group: 'run', d: 'Every change is an event you can subscribe to, replay and audit.', links: ['api', 'auto', 'queue'] },
  { id: 'queue', label: 'Job queue', group: 'run', d: 'Retries with backoff, idempotency keys and per-tenant fairness out of the box.', links: ['events', 'auto'] },
  { id: 'obs', label: 'Observability', group: 'run', d: 'Traces, metrics and logs for every run, linked to the record that caused it.', links: ['events', 'audit'] },
  { id: 'sso', label: 'SSO', group: 'secure', d: 'SAML and OIDC with just-in-time provisioning and SCIM for deprovisioning.', links: ['rbac'] },
  { id: 'rbac', label: 'Permissions', group: 'secure', d: 'Role- and field-level access, defined once and enforced everywhere, including the API.', links: ['sso', 'audit', 'api'] },
  { id: 'audit', label: 'Audit log', group: 'secure', d: 'An append-only record of who did what, exportable to your SIEM.', links: ['rbac', 'obs'] },
];
const GROUP_LABEL: Record<Group, string> = { build: 'Build', run: 'Run', secure: 'Secure' };
const GROUP_ANGLE: Record<Group, number> = { build: -90, run: 30, secure: 150 };

export default function InteractiveCapabilityMap({ config, className }: SectionProps<InteractiveCapabilityMapConfig>) {
  const c = { ...defaults, ...config };
  const uid = useId();
  const [filter, setFilter] = useState(c.filter);
  const [sel, setSel] = useState<string>('api');
  const refs = useRef<Record<string, SVGGElement | null>>({});
  useEffect(() => setFilter(c.filter), [c.filter]);

  // Nodes sit on a ring, each group occupying a 120° arc. Layout is derived, never hand-placed, so adding a node needs no coordinates.
  const R = 160;
  const pos = new Map<string, { x: number; y: number }>();
  (Object.keys(GROUP_ANGLE) as Group[]).forEach((g) => {
    const list = NODES.filter((n) => n.group === g);
    list.forEach((n, i) => {
      const a = ((GROUP_ANGLE[g] - 40 + (i * 80) / Math.max(1, list.length - 1)) * Math.PI) / 180;
      pos.set(n.id, { x: 200 + R * Math.cos(a), y: 200 + R * Math.sin(a) });
    });
  });
  const visible = (n: Node) => filter === 'all' || n.group === filter;
  const selected = NODES.find((n) => n.id === sel) ?? NODES[0];
  const order = NODES.filter(visible);
  const onKey = (e: KeyboardEvent, id: string) => {
    const i = order.findIndex((n) => n.id === id);
    const go = (j: number) => { const n = order[(j + order.length) % order.length]; setSel(n.id); refs.current[n.id]?.focus(); };
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(i + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(order.length - 1); }
  };
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-radius': `${c.radius}px` } as CSSProperties;
  const filters: [InteractiveCapabilityMapConfig['filter'], string][] = [['all', 'All'], ['build', 'Build'], ['run', 'Run'], ['secure', 'Secure']];
  return (
    <section className={`ff-root ff-interactive-capability-map ${className ?? ''}`} style={style} aria-labelledby={`${uid}-h`}>
      <header className="ff-interactive-capability-map__head">
        <h2 id={`${uid}-h`}>The platform, mapped</h2>
        <div role="group" aria-label="Filter by area" className="ff-interactive-capability-map__filters">
          {filters.map(([k, l]) => <button key={k} type="button" aria-pressed={filter === k} onClick={() => { setFilter(k); if (k !== 'all' && NODES.find((n) => n.id === sel)?.group !== k) setSel(NODES.find((n) => n.group === k)!.id); }}>{l}</button>)}
        </div>
      </header>
      <div className="ff-interactive-capability-map__body">
        <svg viewBox="0 0 400 400" className="ff-interactive-capability-map__svg" role="group" aria-label="Capability map. Use arrow keys to move between nodes.">
          {c.showLinks && NODES.flatMap((n) => n.links.filter((l) => n.id < l).map((l) => {
            const a = pos.get(n.id)!, b = pos.get(l)!;
            const on = visible(n) && visible(NODES.find((x) => x.id === l)!);
            const hot = sel === n.id || sel === l;
            return <line key={`${n.id}-${l}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="ff-interactive-capability-map__link" data-hot={hot || undefined} data-off={!on || undefined} />;
          }))}
          <circle cx="200" cy="200" r="46" className="ff-interactive-capability-map__hub" />
          <text x="200" y="204" textAnchor="middle" className="ff-interactive-capability-map__hubtext">Platform</text>
          {NODES.map((n) => {
            const p = pos.get(n.id)!;
            const on = visible(n);
            return (
              <g key={n.id} ref={(el) => { refs.current[n.id] = el; }} transform={`translate(${p.x} ${p.y})`} role="button" tabIndex={on ? (sel === n.id ? 0 : -1) : undefined} aria-hidden={on ? undefined : true}
                aria-pressed={sel === n.id} aria-label={`${n.label}, ${GROUP_LABEL[n.group]}`} className="ff-interactive-capability-map__node" data-group={n.group} data-sel={sel === n.id || undefined} data-linked={(selected.links.includes(n.id)) || undefined} data-off={!on || undefined}
                onClick={() => on && setSel(n.id)} onKeyDown={(e) => { if (on) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(n.id); } else onKey(e, n.id); } }}>
                <circle r={c.nodeSize / 2 + 6} className="ff-interactive-capability-map__halo" />
                <circle r={c.nodeSize / 2} className="ff-interactive-capability-map__dot" />
                {c.showLabels && <text y={c.nodeSize / 2 + 16} textAnchor="middle" className="ff-interactive-capability-map__label">{n.label}</text>}
              </g>
            );
          })}
        </svg>
        <aside className="ff-interactive-capability-map__detail" aria-live="polite">
          <p data-group={selected.group}>{GROUP_LABEL[selected.group]}</p>
          <h3>{selected.label}</h3>
          <p>{selected.d}</p>
          <p className="ff-interactive-capability-map__rel">Works with: {selected.links.map((l) => NODES.find((n) => n.id === l)?.label).join(', ')}</p>
        </aside>
      </div>
    </section>
  );
}
