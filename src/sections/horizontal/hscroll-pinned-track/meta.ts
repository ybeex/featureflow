import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'hscroll-pinned-track',
  name: 'Pinned Horizontal Track',
  description: 'A sticky stage turns vertical scrolling into sideways travel across a row of panels, with a progress bar and a live panel counter.',
  tags: ['horizontal', 'pinned', 'track', 'progress', 'panels', 'storytelling'],
  useCases: ['saas-landing', 'product-site', 'portfolio'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var'],
  layouts: ['track', 'full-bleed'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('panelCount', 'Panels', 'layout', 2, 6, 1),
    range('panelWidth', 'Panel width', 'layout', 40, 85, 1, 'cqw', 'Width of each panel as a percentage of the section width.'),
    range('gap', 'Gap', 'layout', 1, 12, 0.5, 'cqw'),
    toggle('showProgress', 'Progress bar', 'style'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('scrollLength', 'Scroll length', 'motion', 1, 6, 0.5, '×', 'Extra scrolling while pinned, in multiples of the scroller height. Longer feels slower and more deliberate.'),
  ],
  notes: {
    responsive: 'Below 700px container width the pin is removed and the panels become an ordinary vertical stack with the illustration on top; the counter and progress bar are hidden because they would describe nothing.',
    accessibility: 'Panels are an ordered list in reading order, each with its own heading, so the content is fully available without the sideways motion. The counter and progress bar are decorative and hidden from assistive tech; nothing is interactive, so there is no focus trap.',
    motion: 'With prefers-reduced-motion the section renders as a vertical list at every width, with no pinning or translation. Without JavaScript the panels still show, laid out on the track at their starting position.',
    browser: 'Relies on position: sticky, container query units (cqw) and color-mix(), all supported in current browsers. Without container units the track would not travel, so the fallback is the stacked layout.',
    implementation: 'The wrapper is the scroller height times the scroll length; the stage is sticky inside it. useScrollVar writes pinned progress 0 to 1 into one CSS variable and the track does translateX(progress × distance), where the distance is computed in cqw from panel count, width and gap. React state only changes when the active panel changes.',
  },
  component: () => import('./Component'),
});
