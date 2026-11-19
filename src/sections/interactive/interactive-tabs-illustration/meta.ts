import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'interactive-tabs-illustration',
  name: 'Tabbed Feature Showcase',
  description: 'An ARIA tabs interface, horizontal or vertical, that swaps a product illustration and copy per tab, with an optional autoplay that has a visible progress bar and pause button.',
  tags: ['interactive', 'tabs', 'aria-tabs', 'autoplay', 'illustration', 'showcase'],
  useCases: ['saas-landing', 'product-site', 'documentation'],
  complexity: 'moderate',
  techniques: ['state-machine', 'css-animation'],
  layouts: ['split', 'stacked'],
  styles: ['minimal'],
  scrollDriven: false,
  frameHeight: 600,
  featured: true,
  defaults,
  controls: [
    select('orientation', 'Tab orientation', 'layout', [['horizontal', 'Horizontal'], ['vertical', 'Vertical']]),
    range('radius', 'Corner radius', 'layout', 0, 36, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    select('transition', 'Transition', 'motion', [['slide', 'Slide'], ['fade', 'Fade'], ['zoom', 'Zoom']]),
    toggle('autoplay', 'Autoplay', 'motion', 'Advances tabs automatically. Pauses on hover and when the visitor presses the pause button.'),
    range('intervalMs', 'Autoplay interval', 'motion', 2000, 12000, 500, 'ms'),
  ],
  notes: {
    responsive: 'Vertical tabs become a horizontal scrolling pill row below ~640px, and the copy/illustration columns stack. Tabs never wrap to a second line.',
    accessibility: 'Implements the WAI-ARIA tabs pattern: roving tabindex, Left/Right (or Up/Down when vertical), Home and End, aria-selected, aria-controls and labelled tabpanels. Autoplay satisfies WCAG 2.2.2 with a pause control, pausing on hover, and no autoplay under reduced motion. The illustration is decorative.',
    motion: 'Panels animate in with the chosen transition, direction-aware for slide. A progress bar on the active tab shows when autoplay will advance. With reduced motion there is no autoplay and no transition.',
    browser: 'Plain CSS keyframes and roving tabindex; supported everywhere.',
    implementation: 'All panels are rendered with the hidden attribute on inactive ones, so content is in the DOM for search and print. Autoplay is a single setTimeout rescheduled on each change, which makes manual selection reset the timer instead of racing it. The progress bar is keyed to the active index so its animation restarts for each tab.',
  },
  component: () => import('./Component'),
});
