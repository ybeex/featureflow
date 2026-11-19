import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'hscroll-layered-panels',
  name: 'Layered Horizontal Panels',
  description: 'Vertical scrolling drives full-width panels sideways, each with a foreground card and two background layers moving at different rates, plus pinned tabs that jump between panels.',
  tags: ['horizontal', 'parallax', 'layers', 'pinned', 'tabs', 'panels'],
  useCases: ['saas-landing', 'agency', 'portfolio'],
  complexity: 'advanced',
  techniques: ['css-sticky', 'scroll-var'],
  layouts: ['track', 'layered', 'full-bleed'],
  styles: ['dark', 'editorial'],
  scrollDriven: true,
  posterProgress: 0.34,
  frameHeight: 680,
  defaults,
  controls: [
    range('panels', 'Panels', 'layout', 2, 5, 1),
    select('navPosition', 'Tab position', 'layout', [['top', 'Top'], ['bottom', 'Bottom']]),
    range('scrollPerPanel', 'Scroll per panel', 'layout', 0.5, 2.5, 0.1, '× frame', 'How much vertical scrolling each sideways step takes.'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('layerOpacity', 'Layer opacity', 'style', 0.1, 1, 0.05),
    range('parallax', 'Parallax intensity', 'motion', 0, 60, 2, '%', 'How far the layers travel relative to the panels as they slide past.'),
  ],
  notes: {
    responsive: 'Below ~700px the horizontal track is replaced by a plain vertical list of the same panels (no pinning, no sideways travel, no tabs), because a long pinned horizontal scene is hard to use on a phone.',
    accessibility: 'Panels are labelled articles in order; the tabs are real buttons with aria-current marking the active panel and visible numbers, and they scroll the page to the matching position. The background layers are decorative and hidden from assistive tech.',
    motion: 'With reduced motion the scene renders as a vertical list and tabs are removed; there is no parallax. Without JavaScript the first panel is shown within the pinned stage.',
    browser: 'position: sticky, translate3d and container queries are supported in all current browsers; backdrop-filter has a solid-colour fallback.',
    implementation: 'The tall wrapper makes the sticky stage stay in place while useScrollVar writes pinned progress to --ff-p. The strip translates by progress × (n−1)/n, and each layer offsets by (progress × (n−1) − panelIndex) × intensity at a different multiplier, giving depth with transforms only. Tab clicks compute the scroll target from the wrapper’s measured position.',
  },
  component: () => import('./Component'),
});
