# Section contract

A FeatureFlow section is one folder: `src/sections/<category>/<id>/`. The registry discovers it automatically
(`import.meta.glob`), the gallery lists it, the playground renders its controls, and the code viewer shows
**these exact files**. Nothing else needs editing to add a section.

```
src/sections/<category>/<id>/
  config.ts       exported Config interface + `defaults`   (shipped)
  Component.tsx   default export <Name>(props)             (shipped)
  styles.css      all styles, every class prefixed ff-<id> (shipped)
  meta.ts         gallery metadata + control definitions   (NOT shipped)
  *.ts / *.tsx    optional local helpers                   (shipped)
```

`<category>` is one of: scroll-stack, scroll-reveal, sticky, horizontal, split, bento, feature-cards,
image-storytelling, typography, interactive, timeline, comparison, experimental.
`<id>` is kebab-case and must equal the folder name and `meta.id`.

Study the two reference sections before writing anything:
`src/sections/scroll-stack/stack-sticky-cards/` (CSS sticky + Motion scroll progress) and
`src/sections/scroll-reveal/reveal-fade-stagger/` (IntersectionObserver + CSS transitions).

## Component API

```tsx
export default function Name({ config, scrollRoot = null, reducedMotion, paused, className }: SectionProps<NameConfig>)
```
`SectionProps` is in `src/ff/types.ts`. Merge `const c = { ...defaults, ...config }`.
- `scrollRoot`: the element that scrolls (the preview frame). `null` means the window. Use it as the IntersectionObserver
  `root`, as the scroll target for listeners, and as Motion's `container` (see the reference for the ref pattern).
  In the preview it is already set on first render; in production it is usually null.
- `reducedMotion`: pass to `useReducedMotion(reducedMotion)`; it falls back to the OS setting.
- `paused`: stop looping or ambient motion (aurora, particles, marquee, live metrics, autoplay). Honour it.

## Imports (enforced by tests)

Only: `react`, `motion/react`, `lucide-react`, and shared utilities from `src/ff/` via `../../../ff/<name>`.
Available in `src/ff/`: `useInView`, `useScrollVar`, `useActiveIndex`, `useReducedMotion`, `easing` (`easingCss`, `easingTuple`),
`Art` (procedural illustrations), `Mock` (`MockUI`, `BrowserFrame`), `sample` (copy: `FEATURES`, `STEPS`, `STATS`, `BRAND`),
`types`, `base.css`. Always `import '../../../ff/base.css'` and `import './styles.css'`.
Do not edit files in `src/ff/` or anywhere outside your own section folders. If you need a helper, put it in your section folder.

## Hard rules (enforced by `npx vitest run`)

1. **CSS namespace.** Every class selector starts with `.ff-<id>` (BEM: `.ff-<id>__part`, `.ff-<id>--mod`). The root is
   `<section className={\`ff-root ff-<id> ${className ?? ''}\`}>`. Keyframes are named `ff-<id>-*`.
2. **Container-based responsiveness.** `.ff-root` is a size container. Use `@container (max-width: …)` and `cqw` units,
   never width/height `@media`. `@media (prefers-reduced-motion)`, `(hover: none)`, `(pointer: coarse)` are fine.
3. **No viewport units.** Section sizes come from the host frame: use `var(--vp-h, 100vh)` (height of the scroller) and
   `cqw`/`%`. Never raw `vh`, `svh`, `dvh`, `vw`. Never `position: fixed`.
4. **No `any`**, strict TypeScript, no unused variables.
5. **Server-renderable.** The component is rendered with `renderToStaticMarkup` for the HTML export and must produce
   fully visible content: no `window`/`document` access during render (use effects), no inline `opacity:0`.
   Hidden "before reveal" states are applied only after mount through a `data-armed` attribute, and only when
   `!reduced`. Without JS or with reduced motion, all content is visible and readable.
6. **Controls.** `meta.controls` lists only controls that really change the preview, with groups `layout`, `style`
   and `motion` (at least two groups, at least four controls, typically 6 to 12). Every control key exists in
   `defaults`, is read in the component, and its default lies inside the declared range / options. Colours are `#rrggbb`.
   Typical: `background`, `textColor`, `accent`, plus whatever the layout truly needs. Do not add decorative controls.
7. **Metadata.** Fill every field in `meta.ts`, including all five `notes` (specific to this section, not boilerplate).
   Use the vocabularies in `src/registry/types.ts` (`TECHNIQUES`, `LAYOUTS`, `STYLES`, `USE_CASES`).

## Quality rules (reviewed by eye with screenshots)

- **Distinct.** Your sections must differ from their siblings in layout, hierarchy AND interaction technique. No theme
  swaps of one template. Real, specific copy (use `ff/sample` or write your own product-appropriate copy).
- **Real scroll.** Scroll-driven effects respond to actual scroll position of `scrollRoot`. Tall sections derive their
  height from `var(--vp-h, 100vh)` multiples so the preview frame has real room to scroll. Pinned stages use
  `position: sticky` inside a correctly sized parent. No autoplay faking of scroll effects.
- **Performance.** Animate transform/opacity (and clip-path where justified). No scroll listener per element;
  prefer `useScrollVar` (writes one CSS variable), `useInView`, `useActiveIndex`, CSS sticky, or Motion. Any custom
  listener, observer, rAF loop or timer is cleaned up in the effect's return. No layout reads inside scroll handlers.
- **Mobile.** At ~390px container width the section must be usable: no horizontal overflow, pinned areas do not eat
  the screen (shorten or unpin), hover-only information has a tap/focus alternative, touch targets are at least 40px.
- **Accessibility.** Semantic HTML, a real heading (use `useId()` for ids so multiple instances do not collide),
  visible focus (base.css provides a ring), full keyboard operation for anything interactive (tabs, accordions,
  sliders follow WAI-ARIA patterns), text alternatives for imagery and data, state never conveyed by colour or motion
  alone.
- **Imagery.** Only `Art`, `MockUI`/`BrowserFrame`, inline SVG or CSS shapes. No external URLs, no new fonts.
  Reserve aspect ratios so nothing shifts.
- **Theming.** Honour `--ff-bg`, `--ff-fg`, `--ff-accent` etc. set from `config` on the root; derive tints with
  `color-mix(in oklab, …)`. Text must keep at least 4.5:1 contrast at default settings.

## Verify before you finish

The dev server is already running at http://127.0.0.1:5173 (do not start or stop servers).

```bash
npx tsc --noEmit                      # fix errors in YOUR files only (others may be mid-edit)
npx vitest run -t "<your-section-id>" # contract checks
node scripts/shot.mjs <id> --at 0,0.5,1 --out /tmp/ff-shots/<you>      # desktop screenshots + console errors + overflow
node scripts/shot.mjs <id> --w 420 --h 720 --at 0,0.5,1 --out /tmp/ff-shots/<you>   # mobile
node scripts/shot.mjs <id> --reduced --at 0,1 --out /tmp/ff-shots/<you>             # reduced motion
```
Open the PNGs with the Read tool and actually look at them. Check that the first and last scroll positions differ the
way you intend, that nothing overlaps or clips, and that `errors` is empty and `overflowX` is false.
