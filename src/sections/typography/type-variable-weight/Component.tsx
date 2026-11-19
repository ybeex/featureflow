import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type TypeVariableWeightConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const WORD = 'Variable';
const SUB = 'One file. Every weight in between.';

export default function TypeVariableWeight({ config, scrollRoot = null, reducedMotion, paused, className }: SectionProps<TypeVariableWeightConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const live = !reduced && !paused;
  const lo = Math.min(c.minWeight, c.maxWeight);
  const hi = Math.max(c.minWeight, c.maxWeight);

  const setWeights = (fn: (i: number, el: HTMLElement) => number) => {
    word.current?.querySelectorAll<HTMLElement>('[data-ch]').forEach((el, i) => { el.style.fontVariationSettings = `"wght" ${Math.round(fn(i, el))}`; });
  };
  const baseline = (lo + hi) / 2;

  // Pointer mode: weight rises with proximity to the pointer. Wave mode: a travelling sine. Scroll mode: via useScrollVar below.
  useEffect(() => {
    const el = word.current;
    if (!el) return;
    if (!live || c.mode === 'scroll') { setWeights(() => (reduced ? hi : baseline)); return; }
    if (c.mode === 'pointer') {
      setWeights(() => lo);
      const onMove = (e: PointerEvent) => {
        setWeights((_, ch) => {
          const r = ch.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const k = Math.max(0, 1 - d / Math.max(40, c.radius));
          return lo + (hi - lo) * k * k;
        });
      };
      const onLeave = () => setWeights(() => lo);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); };
    }
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      setWeights((i) => baseline + ((hi - lo) / 2) * Math.sin(t * 2.2 - i * 0.7));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, c.mode, lo, hi, c.radius, reduced]);

  useScrollVar(root, {
    scrollRoot, span: 'pass', disabled: !live || c.mode !== 'scroll', staticValue: 1,
    onProgress: (p) => setWeights((i) => lo + (hi - lo) * Math.max(0, Math.min(1, p * 1.6 - i * 0.07))),
  });

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-size': `${c.fontSize}px`, '--ff-fs': c.fontSize } as CSSProperties;
  const hint = c.mode === 'pointer' ? 'Move your pointer across the word.' : c.mode === 'scroll' ? 'Scroll to thicken the letters.' : 'A wave of weight runs through the letters.';
  return (
    <section ref={root} className={`ff-root ff-type-variable-weight ${className ?? ''}`} style={style} aria-labelledby="ff-tvw-h">
      <div className="ff-type-variable-weight__inner">
        <h2 id="ff-tvw-h" ref={word} className="ff-type-variable-weight__word" aria-label={WORD}>
          {WORD.split('').map((ch, i) => <span key={i} data-ch aria-hidden="true">{ch}</span>)}
        </h2>
        <p className="ff-type-variable-weight__sub">{SUB}</p>
        <p className="ff-type-variable-weight__hint">{live ? hint : 'Shown at its heaviest weight.'}</p>
      </div>
    </section>
  );
}
