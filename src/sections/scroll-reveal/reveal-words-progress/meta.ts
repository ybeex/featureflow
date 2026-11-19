import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-words-progress',
  name: 'Word-by-Word Scroll Reveal',
  description: 'A large statement pinned to the screen where every word rises from dim to full opacity in its own slice of the scroll, so reading speed and scroll speed are the same thing.',
  tags: ['words', 'text', 'progress', 'pinned', 'statement', 'scrubbed'],
  useCases: ['saas-landing', 'product-site', 'agency', 'portfolio'],
  complexity: 'moderate',
  techniques: ['scroll-var', 'css-sticky'],
  layouts: ['centered', 'full-bleed'],
  styles: ['dark', 'editorial'],
  scrollDriven: true,
  posterProgress: 0.55,
  frameHeight: 680,
  featured: true,
  defaults,
  controls: [
    range('screens', 'Scroll length', 'layout', 1.5, 6, 0.1, '×', 'How many frame heights the pinned section lasts.'),
    range('fontScale', 'Font scale', 'layout', 0.6, 1.6, 0.05, '×'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('rangeStart', 'Range start', 'motion', 0, 0.6, 0.01, undefined, 'Scroll progress at which the first word begins to light up.'),
    range('rangeEnd', 'Range end', 'motion', 0.4, 1, 0.01, undefined, 'Scroll progress by which the last word is fully lit.'),
    range('dimLevel', 'Dim level', 'motion', 0, 0.6, 0.02, undefined, 'Opacity of words that have not been reached.'),
    range('yShift', 'Vertical shift', 'motion', 0, 48, 1, 'px'),
  ],
  notes: {
    responsive: 'Type size follows container width (cqw) and the pinned run shortens to at most 2.4 frame heights below 520px, so the stage never holds a phone screen for long. The statement wraps naturally; there is no fixed line breaking.',
    accessibility: 'The statement is one real h2 with plain text in spans, so screen readers read it once, in order, with no duplicated or aria-hidden copy. Dimmed words stay in the document at the dim level you choose; keep it at or above 0.2 for readable previews. Accent words are also fully lit before finishing, so meaning never relies on colour.',
    motion: 'With reduced motion or without JavaScript the sticky stage and dimming are never applied: the whole statement renders at full opacity as a normal block. The dim state is armed only after mount through data-armed.',
    browser: 'Needs CSS clamp() inside calc() and color-mix(), available in all current evergreen browsers. position: sticky is used for pinning; older engines simply scroll the statement past.',
    implementation: 'useScrollVar writes one --ff-p (0-1 over the pinned section) on the root. Each word carries only an index --i; CSS derives its own 0-1 progress with clamp((p - start - i*step) / window) and maps it to opacity and translateY. There is no per-word JavaScript and no re-render while scrolling.',
  },
  component: () => import('./Component'),
});
