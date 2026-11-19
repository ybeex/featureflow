import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import { useScrollVar } from '../../../ff/useScrollVar';
import type { SectionProps } from '../../../ff/types';
import { defaults, type MediaImageSequenceConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

const LABELS = ['Cover glass', 'Display', 'Sensor board', 'Battery', 'Chassis', 'Back plate'];

/**
 * Draws one frame of the sequence. This is a procedural "exploded view": each part is a rounded slab drawn in
 * isometric projection; progress separates them vertically. The same function renders any frame, so scrubbing
 * is exact and needs no downloaded image files.
 */
function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, c: MediaImageSequenceConfig, fg: string) {
  ctx.clearRect(0, 0, w, h);
  const n = Math.max(3, Math.min(6, Math.round(c.parts)));
  const size = Math.min(w, h) * 0.36;
  const gap = (c.spread / 100) * (h * 0.115) * t;
  const spin = c.rotate ? (t - 0.5) * 0.5 : 0;
  const cx = w / 2;
  const cy = h / 2 + ((n - 1) * gap) / 2 - h * 0.03;
  for (let i = n - 1; i >= 0; i--) {
    const y = cy - i * gap + (n - 1) * 0 - i * (size * 0.07);
    const hue = 190 + i * 22;
    const a = size, b = size * 0.55;
    const rot = spin * (1 + i * 0.12);
    ctx.save();
    ctx.translate(cx, y);
    ctx.scale(1, 0.5);
    ctx.rotate(Math.PI / 4 + rot);
    const lg = ctx.createLinearGradient(-a / 2, -a / 2, a / 2, a / 2);
    lg.addColorStop(0, `hsl(${hue} 70% 62%)`);
    lg.addColorStop(1, `hsl(${hue + 30} 70% 42%)`);
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.roundRect(-a / 2, -a / 2, a, a, a * 0.08);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.stroke();
    ctx.restore();
    // Side thickness, drawn as a band under the slab.
    ctx.save();
    ctx.translate(cx, y);
    ctx.fillStyle = `hsl(${hue + 20} 60% 28%)`;
    ctx.beginPath();
    ctx.ellipse(0, b * 0.5 + 6, a * 0.5, b * 0.12, 0, 0, Math.PI);
    ctx.fill();
    ctx.restore();
    // Leader line + label appear as parts separate.
    const alpha = Math.max(0, Math.min(1, (t - 0.25) * 2.2));
    if (alpha > 0) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = fg;
      ctx.fillStyle = fg;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + a * 0.5, y);
      ctx.lineTo(cx + a * 0.76, y);
      ctx.stroke();
      ctx.font = `600 ${Math.max(11, Math.min(15, w / 60))}px system-ui, sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(LABELS[i], cx + a * 0.8, y);
      ctx.restore();
    }
  }
}

export default function MediaImageSequence({ config, scrollRoot = null, reducedMotion, className }: SectionProps<MediaImageSequenceConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(reduced ? 1 : 0);
  const [frame, setFrame] = useState(reduced ? c.frames : 1);
  const frames = Math.max(8, Math.round(c.frames));

  const render = useCallback(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = el.clientWidth, h = el.clientHeight;
    if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) { el.width = Math.round(w * dpr); el.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Quantise progress to a whole frame number, exactly as an image sequence would.
    const idx = Math.min(frames - 1, Math.round(progress.current * (frames - 1)));
    drawFrame(ctx, w, h, idx / (frames - 1), c, getComputedStyle(el).color);
  }, [c, frames]);

  const onProgress = useCallback((p: number) => {
    progress.current = p;
    render();
    setFrame((f) => { const next = Math.min(frames, Math.round(p * (frames - 1)) + 1); return f === next ? f : next; });
  }, [render, frames]);

  useScrollVar(trackRef, { scrollRoot, span: 'pinned', disabled: reduced, onProgress, staticValue: 1 });

  useEffect(() => {
    render();
    const el = canvas.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(render);
    ro.observe(el);
    return () => ro.disconnect();
  }, [render]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent, '--ff-len': c.scrollLength } as CSSProperties;
  return (
    <section className={`ff-root ff-media-image-sequence ${className ?? ''}`} style={style} data-reduced={reduced || undefined} aria-labelledby="ff-mis-h">
      <div ref={trackRef} className="ff-media-image-sequence__track">
        <div className="ff-media-image-sequence__stage">
          <header><h2 id="ff-mis-h">Take it apart</h2><p>Scroll to separate the layers.</p></header>
          <canvas ref={canvas} className="ff-media-image-sequence__canvas" role="img" aria-label={`Exploded view of a device with ${Math.round(c.parts)} layers: ${LABELS.slice(0, Math.round(c.parts)).join(', ')}.`} />
          {c.showCounter && <p className="ff-media-image-sequence__counter" aria-hidden="true">Frame <b>{String(frame).padStart(String(frames).length, '0')}</b> / {frames}</p>}
          <ol className="ff-visually-hidden">{LABELS.slice(0, Math.round(c.parts)).map((l) => <li key={l}>{l}</li>)}</ol>
        </div>
      </div>
    </section>
  );
}
