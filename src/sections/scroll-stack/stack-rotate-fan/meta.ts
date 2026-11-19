import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'stack-rotate-fan',
  name: 'Rotating Card Fan',
  description: 'A tidy pile of cards fans out along an arc as you scroll through a pinned stage, ending in a readable spread.',
  tags: ['stack', 'rotation', 'fan', 'arc', 'pinned', 'dark'],
  useCases: ['saas-landing', 'portfolio', 'agency'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var'],
  layouts: ['stacked', 'layered'],
  styles: ['dark', 'playful'],
  scrollDriven: true,
  posterProgress: 0.85,
  frameHeight: 720,
  defaults,
  controls: [
    range('cardCount', 'Cards', 'layout', 3, 7, 1),
    range('cardWidth', 'Card width', 'layout', 180, 320, 4, 'px'),
    range('spreadRadius', 'Spread radius', 'layout', 300, 1400, 20, 'px', 'Distance from the cards to the pivot they swing around. Larger values spread the cards further apart.'),
    range('pivotOffset', 'Pivot offset', 'layout', -200, 400, 10, 'px'),
    range('radius', 'Corner radius', 'layout', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('fanAngle', 'Rotation strength', 'motion', 10, 120, 2, '°', 'Total angle between the first and last card once fully fanned.'),
    range('scrollLength', 'Scroll length', 'motion', 1.5, 6, 0.25, '× frame'),
  ],
  notes: {
    responsive: 'Below ~640px of container width the fan is replaced by a plain stacked list: there is no room for an arc, and a pinned fan would trap the reader.',
    accessibility: 'The cards are list items in reading order. Rotation never exceeds the fan angle so text stays legible; with the default spread each card’s heading remains visible when overlapped.',
    motion: 'With reduced motion the deck renders as a static responsive grid of the same cards. Without JavaScript the fan stays closed (progress 0) but the CSS fallback list still applies on narrow widths.',
    browser: 'Pure CSS transforms with a calc()-driven angle; container queries and sticky positioning are supported in all current browsers.',
    implementation: 'useScrollVar writes pinned progress to --ff-p. Each card rotates by (index − centre) × step × --ff-p degrees around a transform-origin placed far below the card, so rotation alone produces the arc. No JavaScript runs per frame beyond one style write.',
  },
  component: () => import('./Component'),
});
