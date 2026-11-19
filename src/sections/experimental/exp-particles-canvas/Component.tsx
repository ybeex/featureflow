import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type ExpParticlesCanvasConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

interface P { x: number; y: number; vx: number; vy: number; tx: number; ty: number; sx: number; sy: number; t: number }

/** Rasterises the word off-screen and returns `count` random filled pixel positions as formation targets. */
function sampleWord(word: string, w: number, h: number, count: number): { x: number; y: number }[] {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.floor(w));
  off.height = Math.max(1, Math.floor(h));
  const g = off.getContext('2d', { willReadFrequently: true });
  if (!g) return [];
  let size = h * 0.55;
  g.font = `800 ${size}px "Inter Variable", Inter, system-ui, sans-serif`;
  const tw = g.measureText(word).width;
  if (tw > w * 0.86) { size *= (w * 0.86) / tw; g.font = `800 ${size}px "Inter Variable", Inter, system-ui, sans-serif`; }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(word, w / 2, h / 2);
  const data = g.getImageData(0, 0, off.width, off.height).data;
  const pts: { x: number; y: number }[] = [];
  const step = 3;
  for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step) if (data[(y * off.width + x) * 4 + 3] > 128) pts.push({ x, y });
  for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
  return pts.slice(0, count);
}

export default function ExpParticlesCanvas({ config, scrollRoot = null, reducedMotion, paused, className }: SectionProps<ExpParticlesCanvasConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(reduced ? 1 : 0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const live = !reduced && !paused;
  useScrollVar(track, { scrollRoot, span: 'pinned', disabled: reduced || c.assemble !== 'scroll', staticValue: 1, onProgress: (p) => { progress.current = p; } });

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    let raf = 0;
    let parts: P[] = [];
    let w = 0, h = 0, dpr = 1;
    let visible = true;
    const setup = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = el.clientWidth; h = el.clientHeight;
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const targets = sampleWord(c.word.slice(0, 10) || 'FLOW', w, h, c.count);
      parts = targets.map((t, i) => {
        const a = Math.random() * Math.PI * 2, r = Math.max(w, h) * (0.35 + Math.random() * 0.45);
        const sx = w / 2 + Math.cos(a) * r, sy = h / 2 + Math.sin(a) * r;
        return { x: sx, y: sy, vx: 0, vy: 0, tx: t.x, ty: t.y, sx, sy, t: i / targets.length };
      });
    };
    setup();
    const ro = new ResizeObserver(() => { setup(); if (!live) draw(); });
    ro.observe(el);
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; }, { root: scrollRoot });
    io.observe(el);

    const start = performance.now();
    const form = () => (c.assemble === 'auto' ? Math.min(1, ((performance.now() - start) % 9000) / 3000) * (((performance.now() - start) % 9000) < 6000 ? 1 : 0) : progress.current);
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of parts) {
        ctx!.fillStyle = `color-mix(in srgb, ${c.colorA} ${Math.round((1 - p.t) * 100)}%, ${c.colorB})`;
        ctx!.fillRect(p.x - c.size / 2, p.y - c.size / 2, c.size, c.size);
      }
    }
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const f = form();
      const e = Math.max(0.15, Math.min(1, f * 1.25)); // formation strength; starts partly scattered
      for (const p of parts) {
        const gx = p.sx + (p.tx - p.sx) * e, gy = p.sy + (p.ty - p.sy) * e;
        p.vx += (gx - p.x) * c.ease; p.vy += (gy - p.y) * c.ease;
        const m = pointer.current;
        if (m) {
          const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy, R = c.repelRadius;
          if (d2 < R * R) { const d = Math.sqrt(d2) || 1, k = (1 - d / R) * 6; p.vx += (dx / d) * k; p.vy += (dy / d) * k; }
        }
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
      }
      draw();
    };
    if (live) raf = requestAnimationFrame(tick);
    else { for (const p of parts) { p.x = p.tx; p.y = p.ty; } draw(); }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [live, scrollRoot, c.word, c.count, c.size, c.repelRadius, c.ease, c.assemble, c.colorA, c.colorB]);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const style = { '--ff-bg': c.background } as CSSProperties;
  return (
    <section className={`ff-root ff-exp-particles-canvas ${className ?? ''}`} style={style} data-pinned={(c.assemble === 'scroll' && !reduced) || undefined} aria-labelledby="ff-epc-h">
      <div ref={track} className="ff-exp-particles-canvas__track">
        <div className="ff-exp-particles-canvas__stage" onPointerMove={move} onPointerLeave={() => { pointer.current = null; }}>
          <h2 id="ff-epc-h" className="ff-visually-hidden">{c.word}</h2>
          <canvas ref={canvas} className="ff-exp-particles-canvas__canvas" role="img" aria-label={`Particles ${c.assemble === 'scroll' ? 'gather as you scroll to spell' : 'gather and scatter to spell'} the word ${c.word}. Move the pointer to push them away.`} />
          <p className="ff-exp-particles-canvas__hint" aria-hidden="true">{c.assemble === 'scroll' ? 'Scroll to assemble · move your pointer to scatter' : 'Move your pointer to scatter'}</p>
        </div>
      </div>
    </section>
  );
}
