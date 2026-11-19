import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Zap, ShieldCheck, Workflow, LineChart } from 'lucide-react';
import { Art } from '../../../ff/Art';
import { MockUI } from '../../../ff/Mock';
import { useInView } from '../../../ff/useInView';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type BentoHeroTileConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const SMALL = [
  { icon: Zap, t: 'Instant search', d: 'Across every tool, in under 200 ms.' },
  { icon: ShieldCheck, t: 'Enterprise-ready', d: 'SSO, audit logs and data residency.' },
  { icon: Workflow, t: 'Automations', d: 'Plain-language rules with a dry run.' },
  { icon: LineChart, t: 'Live reporting', d: 'Ask a question, pin the chart.' },
];

export default function BentoHeroTile({ config, scrollRoot = null, reducedMotion, className }: SectionProps<BentoHeroTileConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(c.reveal && !reduced), [c.reveal, reduced]);
  const seen = useInView(ref, { root: scrollRoot, threshold: 0.15, once: true, disabled: !armed });
  const span = Math.max(1, Math.min(3, Math.round(c.heroSpan)));
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-gap': `${c.gap}px`, '--ff-radius': `${c.radius}px`, '--ff-span': span,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-bento-hero-tile ${className ?? ''}`} style={style} data-armed={armed || undefined} data-side={c.heroSide} data-lift={c.hoverLift || undefined} aria-labelledby="ff-bht-h">
      <header className="ff-bento-hero-tile__head"><h2 id="ff-bht-h">Everything the team needs, nothing it doesn’t</h2></header>
      <div ref={ref} className="ff-bento-hero-tile__grid" data-visible={seen || undefined}>
        <article className="ff-bento-hero-tile__tile ff-bento-hero-tile__hero" style={{ '--i': 0 } as CSSProperties}>
          <div><p className="ff-bento-hero-tile__kicker">The workspace</p><h3>One place for plans, owners and decisions</h3><p>See what is happening across every project without asking anyone.</p></div>
          <div className="ff-bento-hero-tile__shot" aria-hidden="true"><MockUI variant="dashboard" /></div>
        </article>
        {SMALL.map((s, i) => (
          <article key={s.t} className="ff-bento-hero-tile__tile" style={{ '--i': i + 1 } as CSSProperties}>
            <s.icon size={22} aria-hidden="true" />
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            {i === 3 && <Art seed="bht-art" variant="waves" hue={250} decorative ratio="3 / 1" className="ff-bento-hero-tile__art" />}
          </article>
        ))}
      </div>
    </section>
  );
}
