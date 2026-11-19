import type { ReactNode } from 'react';
import { SECTIONS } from '../registry';

const TOPICS: { id: string; title: string; body: () => ReactNode }[] = [
  {
    id: 'start', title: 'Getting started',
    body: () => (<>
      <p>Every section is a self-contained folder of a React component, a typed config, and one stylesheet. Open any section, tune it in the playground, then use the <strong>Code</strong> panel to copy the files.</p>
      <h2>Install</h2>
      <pre>{`# 1. Copy the featureflow/ folder from the Code panel into your project
# 2. Install only what the section lists (many need nothing beyond React)
npm install motion lucide-react`}</pre>
      <h2>Use</h2>
      <pre>{`import StackStickyCards from './featureflow/stack-sticky-cards/Component';

export default function Page() {
  return <StackStickyCards config={{ cardCount: 5, accent: '#6a5cff' }} />;
}`}</pre>
      <p>Every section accepts <span className="kbd">config</span> (partial overrides of its defaults), <span className="kbd">scrollRoot</span> (the scrolling element; omit it to use the window), <span className="kbd">reducedMotion</span> and <span className="kbd">paused</span>. In normal pages you only need <span className="kbd">config</span>.</p>
      <h2>Formats</h2>
      <p>React + TypeScript is the source of truth. The JavaScript tab is the same files compiled to remove types. The Next.js tab adds <span className="kbd">"use client"</span> where hooks are used. The HTML tab is a static snapshot (server-rendered markup plus CSS): it is accurate for layout and styling but contains no script, so scroll-linked and interactive behaviour needs the React version.</p>
    </>),
  },
  {
    id: 'scroll', title: 'Scroll architecture',
    body: () => (<>
      <p>Each effect uses the lightest technique that does the job. There is no global scroll library and no per-element scroll listener.</p>
      <div className="docgrid">
        <div className="doccard"><h3>CSS sticky</h3><p>Pinned stages and card stacks use <span className="kbd">position: sticky</span> inside a parent tall enough to scroll through. No JavaScript is needed for the pinning itself.</p></div>
        <div className="doccard"><h3>useScrollVar</h3><p>Writes one CSS custom property (<span className="kbd">--ff-p</span>, 0 to 1) per section once per animation frame. CSS <span className="kbd">calc()</span> does the rest, so React never re-renders while scrolling. Layout is measured on mount and resize, not in the handler.</p></div>
        <div className="doccard"><h3>useInView / useActiveIndex</h3><p>IntersectionObserver for “enters the viewport” triggers and for “which step is centred” state. Supports once, replay and a visibility threshold.</p></div>
        <div className="doccard"><h3>Motion</h3><p>Used where several values must be derived from one scroll progress (card scale, parallax, path morphing).</p></div>
        <div className="doccard"><h3>Native scrolling</h3><p>Carousels and timelines use overflow and scroll-snap, so keyboard, touch and assistive technology work without custom code.</p></div>
        <div className="doccard"><h3>Containers, not windows</h3><p>Sections size from their container with <span className="kbd">@container</span> and <span className="kbd">cqw</span> units. That is why the tablet and mobile previews are accurate: the same layout rules run at the frame width.</p></div>
      </div>
    </>),
  },
  {
    id: 'a11y', title: 'Accessibility & motion',
    body: () => (<>
      <ul style={{ display: 'grid', gap: 8 }}>
        <li><strong>Content is never hidden without JavaScript or with reduced motion.</strong> Hidden “before reveal” states are applied only after mount, and only when motion is allowed.</li>
        <li><strong>Reduced motion</strong> renders a complete, readable static layout. Use the <em>Reduced motion</em> and <em>Animation off</em> toggles in any playground to see it.</li>
        <li><strong>Keyboard:</strong> tabs, accordions, sliders, carousels and navigation follow WAI-ARIA authoring practices, with visible focus.</li>
        <li><strong>State is never conveyed by colour or motion alone</strong>: icons and text labels accompany availability, progress and active steps.</li>
        <li><strong>Data</strong> (counters, bars, charts) has a text alternative that states the final value.</li>
        <li><strong>Pinned areas</strong> are shortened or unpinned on small containers so they cannot consume the viewport or trap scrolling.</li>
      </ul>
    </>),
  },
  {
    id: 'add', title: 'Adding a section',
    body: () => (<>
      <p>Create a folder; the registry, gallery, playground and code viewer discover it automatically.</p>
      <pre>{`src/sections/<category>/<id>/
  config.ts       Config interface + defaults
  Component.tsx   default export, uses ../../../ff helpers
  styles.css      every class prefixed ff-<id>
  meta.ts         name, tags, controls, notes (not shipped)`}</pre>
      <p>The contract is enforced by <span className="kbd">npm test</span>: namespaced CSS, container queries instead of media queries, no viewport units, no <span className="kbd">position: fixed</span>, no <span className="kbd">any</span>, controls that exist in the defaults and are really read by the component, server-renderable markup, and complete notes. See <span className="kbd">docs/SECTION_CONTRACT.md</span> in the repository for the full rules.</p>
    </>),
  },
  {
    id: 'limits', title: 'Known limits',
    body: () => (<>
      <p>Honest gaps in the current library:</p>
      <ul style={{ display: 'grid', gap: 8 }}>
        <li>The HTML + CSS export is a static snapshot. Sections whose behaviour is script-driven (scroll progress, tabs, carousels) need the React version.</li>
        <li>Gallery thumbnails are live renders parked at a representative scroll position with ambient motion paused. They are not interactive: use the eye button for a full interactive preview.</li>
        <li>Tablet and mobile previews resize the frame (and therefore container queries); they do not emulate touch input or browser chrome.</li>
        <li>Imagery is procedural SVG and markup-built mock interfaces, by design, so previews never depend on external URLs.</li>
        <li>WebGL and shader transitions are not included; the experimental set uses CSS, SVG and canvas.</li>
      </ul>
      <p>Currently <strong>{SECTIONS.length}</strong> sections are registered.</p>
    </>),
  },
];

export function Docs({ topic }: { topic?: string }) {
  const current = TOPICS.find((t) => t.id === topic) ?? TOPICS[0];
  return (
    <div className="container">
      <header className="pagehead"><p className="eyebrow">Documentation</p><h1>{current.title}</h1></header>
      <div className="docs">
        <nav className="docs__nav" aria-label="Documentation topics">
          {TOPICS.map((t) => <a key={t.id} href={`#/docs/${t.id}`} aria-current={t.id === current.id ? 'true' : undefined}>{t.title}</a>)}
        </nav>
        <article className="prose">{current.body()}</article>
      </div>
    </div>
  );
}
