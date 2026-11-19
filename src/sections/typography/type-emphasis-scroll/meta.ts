import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'type-emphasis-scroll',
  name: 'Scroll-Focused Emphasis Text',
  description: 'A large statement in which key phrases are highlighted as they pass through a band at the middle of the viewport, as a marker sweep, an underline or a colour change, while the rest of the text recedes.',
  tags: ['typography', 'emphasis', 'highlight', 'marker', 'scroll', 'editorial'],
  useCases: ['saas-landing', 'agency', 'portfolio'],
  complexity: 'moderate',
  techniques: ['intersection-observer', 'css-transition'],
  layouts: ['centered', 'stacked'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 620,
  defaults,
  controls: [
    range('fontSize', 'Maximum font size', 'layout', 28, 72, 1, 'px'),
    range('bandSize', 'Focus band height', 'layout', 8, 45, 1, '%', 'The share of the viewport, centred vertically, in which a phrase counts as being in focus.'),
    select('mark', 'Emphasis style', 'style', [['marker', 'Marker highlight'], ['underline', 'Underline'], ['color', 'Colour change']]),
    range('thickness', 'Marker thickness', 'style', 15, 100, 1, '%'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Highlight colour'),
    toggle('dimOthers', 'Dim the rest', 'motion'),
  ],
  notes: {
    responsive: 'Font size is clamped between a floor and the chosen maximum, and the highlight is a background gradient with box-decoration-break: clone, so a phrase that wraps across lines highlights correctly on every line.',
    accessibility: 'The text is ordinary paragraph text with <mark> elements, so assistive tech reads it all at once and the emphasis is also conveyed semantically. Dimmed text stays at 38% opacity only while a phrase is highlighted, and every phrase is fully emphasised and readable when motion is reduced.',
    motion: 'Highlight sweeps and dimming run when a phrase enters the focus band and reverse when it leaves. With reduced motion there is no observer and no dimming: all emphasised phrases are simply highlighted permanently.',
    browser: 'IntersectionObserver with percentage rootMargin; background-size transitions and box-decoration-break are supported in all current browsers (Safari needs the -webkit- prefix, included).',
    implementation: 'One observer watches every emphasised phrase with a rootMargin that shrinks the viewport to a horizontal band, so “in view” means “in focus”. State is an array of booleans updated only when a phrase crosses the band edge, not per scroll event. The hidden start state is applied after mount, so the server markup is already fully legible.',
  },
  component: () => import('./Component'),
});
