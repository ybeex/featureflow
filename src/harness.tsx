// Dev-only: mounts one section inside a scroll container so it can be screenshotted and probed.
//   /harness.html?id=<section-id>&w=1200&h=720&reduced=1&cfg={"accent":"#0af"}
import { StrictMode, Suspense, lazy, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import { getSection } from './registry';
import type { SectionProps } from './ff/types';

const q = new URLSearchParams(location.search);
const id = q.get('id') ?? '';
const w = Number(q.get('w') ?? 1200);
const h = Number(q.get('h') ?? 720);
const reduced = q.get('reduced') === '1' ? true : undefined;
const paused = q.get('paused') === '1';
let cfg: Record<string, unknown> = {};
try { cfg = JSON.parse(q.get('cfg') ?? '{}'); } catch { /* ignore */ }

const meta = getSection(id);

function Harness() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  if (!meta) return <p style={{ padding: 20 }}>Unknown section “{id}”.</p>;
  const Section = lazy(meta.component) as ComponentType<SectionProps<Record<string, unknown>>>;
  return (
    <div
      id="scroller"
      ref={setRoot}
      style={{ width: w, height: h, overflow: 'auto', position: 'relative', background: '#fff', ['--vp-h' as string]: `${h}px` }}
    >
      {root && (
        <Suspense fallback={<p>Loading…</p>}>
          <Section config={cfg} scrollRoot={root} reducedMotion={reduced} paused={paused} />
          <Ready />
        </Suspense>
      )}
    </div>
  );
}

function Ready() {
  requestAnimationFrame(() => requestAnimationFrame(() => ((window as unknown as { __ffReady: boolean }).__ffReady = true)));
  return null;
}

createRoot(document.getElementById('h')!).render(<StrictMode><Harness /></StrictMode>);
