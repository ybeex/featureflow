import { useId, type CSSProperties, type ReactNode } from 'react';

export type ArtVariant = 'dunes' | 'orbit' | 'waves' | 'peaks' | 'grid' | 'blocks';
const VARIANTS: ArtVariant[] = ['dunes', 'orbit', 'waves', 'peaks', 'grid', 'blocks'];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hsl = (h: number, s: number, l: number, a = 1) => `hsl(${Math.round(h) % 360} ${s}% ${l}% / ${a})`;

function wave(y: number, amp: number, freq: number, phase: number): string {
  let d = `M0 500 L0 ${y}`;
  for (let x = 0; x <= 800; x += 16) {
    d += ` L${x} ${(y + Math.sin(x * freq + phase) * amp).toFixed(1)}`;
  }
  return d + ' L800 500 Z';
}

export interface ArtProps {
  /** Same seed → same picture. */
  seed: string;
  variant?: ArtVariant;
  /** Base hue 0–360. Derived from the seed when omitted. */
  hue?: number;
  /** Accessible description. Use decorative for purely ornamental art. */
  label?: string;
  decorative?: boolean;
  /** CSS aspect-ratio, reserved up front so nothing shifts while the scene renders. */
  ratio?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Procedural, dependency-free illustration. Used wherever a section needs imagery,
 * so previews never depend on external image URLs and always have fixed dimensions.
 */
export function Art({ seed, variant, hue, label, decorative = false, ratio = '16 / 10', className, style }: ArtProps) {
  const uid = useId().replace(/:/g, '');
  const h0 = hash(seed);
  const rand = rng(h0);
  const v = variant ?? VARIANTS[h0 % VARIANTS.length];
  const base = hue ?? h0 % 360;
  const shift = (n: number) => base + n;
  const g = `g${uid}`;
  const shapes: ReactNode[] = [];

  if (v === 'dunes') {
    for (let i = 0; i < 5; i++) {
      shapes.push(
        <path key={i} d={wave(250 + i * 48, 22 + rand() * 20, 0.008 + rand() * 0.01, rand() * 6)} fill={hsl(shift(i * 8), 55, 62 - i * 10)} />,
      );
    }
    shapes.unshift(<circle key="sun" cx={560 + rand() * 120} cy={150 + rand() * 40} r={54 + rand() * 20} fill={hsl(shift(40), 90, 78)} opacity={0.95} />);
  } else if (v === 'orbit') {
    for (let i = 0; i < 6; i++) {
      const rx = 90 + i * 55;
      shapes.push(
        <ellipse key={i} cx={400} cy={250} rx={rx} ry={rx * (0.35 + rand() * 0.2)} fill="none" stroke={hsl(shift(i * 14), 80, 72, 0.5)} strokeWidth={1.5} transform={`rotate(${-20 + i * 9} 400 250)`} />,
      );
      shapes.push(<circle key={`d${i}`} cx={400 + rx * Math.cos(rand() * 6.28)} cy={250 + rx * 0.4 * Math.sin(rand() * 6.28)} r={4 + rand() * 7} fill={hsl(shift(i * 14 + 30), 90, 78)} />);
    }
    shapes.push(<circle key="core" cx={400} cy={250} r={34} fill={hsl(shift(30), 95, 70)} />);
  } else if (v === 'waves') {
    for (let i = 0; i < 7; i++) {
      shapes.push(<path key={i} d={wave(120 + i * 52, 26 + rand() * 18, 0.006 + rand() * 0.012, rand() * 6)} fill={hsl(shift(i * 9), 70, 30 + i * 8, 0.85)} />);
    }
  } else if (v === 'peaks') {
    for (let i = 0; i < 4; i++) {
      let d = `M-20 500`;
      let x = -20;
      while (x < 820) {
        x += 70 + rand() * 90;
        d += ` L${x - 35} ${180 + i * 50 - rand() * 90} L${x} ${300 + i * 40}`;
      }
      d += ' L820 500 Z';
      shapes.push(<path key={i} d={d} fill={hsl(shift(i * 6), 38, 78 - i * 20)} />);
    }
  } else if (v === 'grid') {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 10; c++) {
        shapes.push(
          <rect key={`${r}-${c}`} x={c * 80 + 14} y={r * 84 + 8} width={52} height={52} rx={14} fill={hsl(shift(rand() * 40), 70, 55 + rand() * 25)} opacity={0.25 + rand() * 0.75} transform={`rotate(${(rand() * 20 - 10).toFixed(1)} ${c * 80 + 40} ${r * 84 + 34})`} />,
        );
      }
    }
  } else {
    for (let i = 0; i < 9; i++) {
      shapes.push(<rect key={i} x={rand() * 620} y={rand() * 360} width={90 + rand() * 220} height={70 + rand() * 170} rx={6} fill={hsl(shift(rand() * 90), 70, 45 + rand() * 30)} opacity={0.8} />);
    }
  }

  const dark = v === 'orbit' || v === 'waves';
  return (
    <div className={className} style={{ aspectRatio: ratio, overflow: 'hidden', background: hsl(shift(0), 40, dark ? 12 : 88), ...style }}>
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : label ?? `Abstract ${v} illustration`}
        aria-hidden={decorative ? true : undefined}
      >
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={hsl(shift(-10), 70, dark ? 20 : 86)} />
            <stop offset="1" stopColor={hsl(shift(30), 70, dark ? 8 : 70)} />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill={`url(#${g})`} />
        {shapes}
      </svg>
    </div>
  );
}
