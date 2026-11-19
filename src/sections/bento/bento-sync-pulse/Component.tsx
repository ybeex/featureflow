import { useEffect, useState, type CSSProperties } from 'react';
import { GitBranch, MessageSquare, Bell, Database, BarChart3 } from 'lucide-react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type BentoSyncPulseConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

// Each node lists the nodes it feeds. Hovering, focusing or the auto cycle highlights a node and everything downstream.
const NODES = [
  { id: 'code', icon: GitBranch, t: 'Code', d: 'A merged pull request closes its ticket.', to: ['tickets', 'data'] },
  { id: 'tickets', icon: MessageSquare, t: 'Tickets', d: 'Status changes post to the team channel.', to: ['alerts'] },
  { id: 'data', icon: Database, t: 'Warehouse', d: 'Release events land with every deploy.', to: ['reports'] },
  { id: 'alerts', icon: Bell, t: 'Alerts', d: 'Owners are notified once, in one place.', to: [] },
  { id: 'reports', icon: BarChart3, t: 'Reports', d: 'Cycle time updates without anyone touching it.', to: ['alerts'] },
] as const;

function downstream(id: string, seen = new Set<string>()): Set<string> {
  seen.add(id);
  const n = NODES.find((x) => x.id === id);
  n?.to.forEach((t) => { if (!seen.has(t)) downstream(t, seen); });
  return seen;
}

export default function BentoSyncPulse({ config, reducedMotion, paused, className }: SectionProps<BentoSyncPulseConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const [auto, setAuto] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const cycling = c.autoCycle && !reduced && !paused && hover === null;
  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(() => setAuto((a) => (a + 1) % NODES.length), Math.max(800, c.cycleMs));
    return () => window.clearInterval(id);
  }, [cycling, c.cycleMs]);

  const focus = hover ?? (c.autoCycle && !reduced ? NODES[auto].id : null);
  const lit = focus ? downstream(focus) : new Set<string>();
  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px` } as CSSProperties;
  return (
    <section className={`ff-root ff-bento-sync-pulse ${className ?? ''}`} style={style} data-link={c.linkStyle} data-lines={c.showLines || undefined} aria-labelledby="ff-bsp-h">
      <header className="ff-bento-sync-pulse__head">
        <h2 id="ff-bsp-h">Change one thing, and everything that depends on it follows</h2>
        <p>Hover or focus a tile to trace what it updates{c.autoCycle && !reduced ? '. It also cycles by itself until you do.' : '.'}</p>
      </header>
      <ul className="ff-bento-sync-pulse__grid" onPointerLeave={() => setHover(null)}>
        {NODES.map((n) => {
          const isSource = focus === n.id;
          const isLit = lit.has(n.id);
          return (
            <li key={n.id} className="ff-bento-sync-pulse__tile" data-source={isSource || undefined} data-lit={isLit || undefined} style={{ gridArea: n.id } as CSSProperties}>
              <button type="button" onPointerEnter={() => setHover(n.id)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)} aria-describedby={`ff-bsp-${n.id}`}>
                <n.icon size={22} aria-hidden="true" />
                <span className="ff-bento-sync-pulse__t">{n.t}</span>
                <span id={`ff-bsp-${n.id}`} className="ff-bento-sync-pulse__d">{n.d}{n.to.length > 0 && <> Updates: {n.to.map((t) => NODES.find((x) => x.id === t)?.t).join(', ')}.</>}</span>
              </button>
              {isLit && !isSource && <span className="ff-bento-sync-pulse__badge">Synced</span>}
              {isSource && <span className="ff-bento-sync-pulse__badge">Changed</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
