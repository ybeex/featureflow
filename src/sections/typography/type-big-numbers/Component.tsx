import { useRef, type CSSProperties } from 'react';
import { STATS } from '../../../ff/sample';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TypeBigNumbersConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

function Row({ s, scrollRoot, reduced }: { s: (typeof STATS)[number]; scrollRoot: HTMLElement | null; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  useScrollVar(ref, { scrollRoot, span: 'pass', disabled: reduced, staticValue: 0.5 });
  const shown = `${s.decimals ? s.value.toFixed(s.decimals) : s.value.toLocaleString('en-US')}${s.suffix}`;
  return (
    <li ref={ref} className="ff-type-big-numbers__row">
      <span className="ff-type-big-numbers__num" aria-hidden="true">{shown}</span>
      <p><strong>{s.label}</strong><span>{s.note}</span></p>
      <span className="ff-visually-hidden">{shown}</span>
    </li>
  );
}

export default function TypeBigNumbers({ config, scrollRoot = null, reducedMotion, className }: SectionProps<TypeBigNumbersConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const style = {
    '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-a': c.accent, '--ff-b': c.accent2, '--ff-size': `${c.fontSize}px`, '--ff-fs': c.fontSize, '--ff-gap': `${c.rowGap}px`, '--ff-idle': `${Math.round(c.idleOpacity * 100)}%`,
  } as CSSProperties;
  return (
    <section className={`ff-root ff-type-big-numbers ${className ?? ''}`} style={style} data-fill={c.fill} data-align={c.align} data-reduced={reduced || undefined} aria-labelledby="ff-tbn-h">
      <h2 id="ff-tbn-h" className="ff-type-big-numbers__title">The numbers behind the product</h2>
      <ul className="ff-type-big-numbers__list">{STATS.map((s) => <Row key={s.label} s={s} scrollRoot={scrollRoot} reduced={reduced} />)}</ul>
    </section>
  );
}
