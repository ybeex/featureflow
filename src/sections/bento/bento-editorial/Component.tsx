import type { CSSProperties } from 'react';
import { Art } from '../../../ff/Art';
import type { SectionProps } from '../../../ff/types';
import { defaults, type BentoEditorialConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

export default function BentoEditorial({ config, className }: SectionProps<BentoEditorialConfig>) {
  const c = { ...defaults, ...config };
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-paper': c.paper, '--ff-radius': `${c.radius}px`, '--ff-num': c.numberScale,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-bento-editorial ${className ?? ''}`} style={style} data-serif={c.serif || undefined} data-density={c.density} data-border={c.border} aria-labelledby="ff-be-h">
      <header className="ff-bento-editorial__mast"><p>The Annual Field Report</p><p>Issue 07 · 2026</p></header>
      <div className="ff-bento-editorial__grid">
        <article className="ff-bento-editorial__tile ff-bento-editorial__lead">
          <p className="ff-bento-editorial__kicker">Cover story</p>
          <h2 id="ff-be-h">The year teams stopped asking for status updates</h2>
          <p>Across twelve thousand teams, the quietest change was also the biggest: the weekly status meeting stopped being necessary.</p>
        </article>
        <figure className="ff-bento-editorial__tile ff-bento-editorial__fig">
          <Art seed="be-fig" variant="dunes" hue={22} label="Dunes at dusk, an abstract illustration" ratio="4 / 5" className="ff-bento-editorial__art" />
          <figcaption>Fig. 1 — Handoffs per project, down by half.</figcaption>
        </figure>
        <article className="ff-bento-editorial__tile ff-bento-editorial__stat">
          <p className="ff-bento-editorial__num">62%</p>
          <p>fewer recurring meetings</p>
        </article>
        <article className="ff-bento-editorial__tile ff-bento-editorial__quote">
          <blockquote>“We deleted three standing meetings in the first month and nobody noticed.”</blockquote>
          <p className="ff-bento-editorial__by">Priya N., Head of Operations</p>
        </article>
        <article className="ff-bento-editorial__tile ff-bento-editorial__stat">
          <p className="ff-bento-editorial__num">9 days</p>
          <p>faster from idea to launch</p>
        </article>
        <article className="ff-bento-editorial__tile ff-bento-editorial__list">
          <p className="ff-bento-editorial__kicker">Inside</p>
          <ol><li><span>04</span> Why plans drift</li><li><span>11</span> The cost of a handoff</li><li><span>18</span> Dashboards that answer back</li><li><span>26</span> A week without meetings</li></ol>
        </article>
      </div>
    </section>
  );
}
