import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type ExpMorphShapesConfig, type MorphShape } from './config';
import '../../../ff/base.css';
import './styles.css';

const TAU = Math.PI * 2;

/** Radius (0..1 of the half-size) of each shape at polar angle `a`. */
function radiusOf(shape: MorphShape, a: number): number {
  switch (shape) {
    case 'circle':
      return 0.86;
    case 'blob':
      return 0.72 + 0.1 * Math.sin(a * 3 + 0.6) + 0.07 * Math.sin(a * 5 + 2.1) + 0.04 * Math.cos(a * 2);
    case 'star': {
      // 5-point star: interpolate between inner and outer radius with a sharp triangle wave.
      const k = Math.abs(((a * 5) / TAU) % 1 - 0.5) * 2; // 1 at tips (0), 0 at valleys
      return 0.38 + 0.52 * (1 - k);
    }
    case 'square': {
      const c = Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
      return 0.74 / c;
    }
  }
}

const pointsFor = (shape: MorphShape, n: number): number[] => Array.from({ length: n }, (_, i) => radiusOf(shape, (i / n) * TAU));

const NAMES: Record<MorphShape, string> = { circle: 'Circle', blob: 'Blob', star: 'Star', square: 'Square' };
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Closed path through polar samples. Straight segments are dense enough (≥ 24 points) to read as curves. */
function pathFor(radii: number[], rotation: number): string {
  const n = radii.length;
  const rot = (rotation * Math.PI) / 180;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rot;
    const x = 50 + Math.cos(a) * radii[i] * 46;
    const y = 50 + Math.sin(a) * radii[i] * 46;
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

export default function ExpMorphShapes({ config, scrollRoot = null, reducedMotion, paused, className }: SectionProps<ExpMorphShapesConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const track = useRef<HTMLDivElement>(null);
  const pathEl = useRef<SVGPathElement>(null);
  const labelEl = useRef<HTMLSpanElement>(null);
  const stops: MorphShape[] = [c.first, c.second, c.third];
  const n = Math.max(24, Math.round(c.points));
  const key = `${stops.join()}|${n}|${c.rotation}`;
  const sets = useRef<number[][]>([]);
  const state = useRef({ p: 0, key: '', rot: 0 });

  const apply = useCallback(
    (p: number) => {
      const el = pathEl.current;
      if (!el) return;
      if (state.current.key !== key) {
        sets.current = stops.map((s) => pointsFor(s, n));
        state.current.key = key;
      }
      state.current.p = p;
      const seg = Math.min(stops.length - 2, Math.floor(p * (stops.length - 1)));
      const t = smooth(Math.min(1, Math.max(0, p * (stops.length - 1) - seg)));
      const a = sets.current[seg];
      const b = sets.current[seg + 1];
      const mix = a.map((r, i) => r + (b[i] - r) * t);
      el.setAttribute('d', pathFor(mix, c.rotation + p * 40));
      const idx = t > 0.5 ? seg + 1 : seg;
      if (labelEl.current) labelEl.current.textContent = NAMES[stops[idx]];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, c.rotation],
  );

  useScrollVar(track, { scrollRoot, span: 'pinned', disabled: reduced || !!paused, staticValue: 0, onProgress: apply });

  // Initial / config-change render, and the static value used by reduced motion and pause.
  useEffect(() => {
    apply(reduced ? 0 : state.current.p);
  }, [apply, reduced]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-a': c.colorA, '--ff-b': c.colorB, '--ff-len': c.scrollLength, '--ff-sw': c.strokeWidth } as CSSProperties;
  return (
    <section className={`ff-root ff-exp-morph-shapes ${className ?? ''}`} style={style} data-filled={c.filled || undefined} data-reduced={reduced || undefined} aria-labelledby="ff-ems-h">
      <div ref={track} className="ff-exp-morph-shapes__track">
        <div className="ff-exp-morph-shapes__stage">
          <div className="ff-exp-morph-shapes__copy">
            <p>One path, many forms</p>
            <h2 id="ff-ems-h">A single outline that reshapes itself</h2>
            <span>
              Now showing: <strong ref={labelEl}>{NAMES[stops[0]]}</strong>
            </span>
          </div>
          <svg className="ff-exp-morph-shapes__svg" viewBox="0 0 100 100" role="img" aria-label={`A shape morphing between ${stops.map((s) => NAMES[s].toLowerCase()).join(', ')}`}>
            <defs>
              <linearGradient id="ff-ems-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--ff-a)" />
                <stop offset="1" stopColor="var(--ff-b)" />
              </linearGradient>
            </defs>
            <path ref={pathEl} d={pathFor(pointsFor(stops[0], n), c.rotation)} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
