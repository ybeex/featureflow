import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'cards-expandable',
  name: 'Expandable Feature Cards',
  description: 'Cards that open in place to reveal detail, using real disclosure buttons, with a single-open or multi-open mode and height animation that needs no measuring.',
  tags: ['cards', 'accordion', 'disclosure', 'expand', 'aria-expanded', 'grid'],
  useCases: ['saas-landing', 'documentation', 'product-site'],
  complexity: 'moderate',
  techniques: ['css-transition', 'state-machine'],
  layouts: ['grid'],
  styles: ['minimal'],
  scrollDriven: false,
  frameHeight: 560,
  defaults,
  controls: [
    select('mode', 'Open behaviour', 'layout', [['single', 'One at a time'], ['multiple', 'Several at once']]),
    toggle('startOpen', 'First card starts open', 'layout'),
    range('columns', 'Columns', 'layout', 1, 3, 1),
    toggle('showIcons', 'Show icons', 'style'),
    range('radius', 'Corner radius', 'style', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('duration', 'Duration', 'motion', 0, 900, 20, 'ms'),
  ],
  notes: {
    responsive: 'Columns collapse to one below ~560px. Because panels grow downward and the grid aligns items to the start, opening one card does not stretch its neighbours.',
    accessibility: 'Follows the disclosure pattern: each heading contains a real button with aria-expanded and aria-controls, and the panel is a labelled region. Collapsed panels are visibility: hidden after the animation so their content is not focusable or read. Enter and Space work because they are native buttons.',
    motion: 'Height animates via grid-template-rows (0fr → 1fr) and the plus icon rotates. With reduced motion the duration variable is 0ms, so panels open instantly.',
    browser: 'Animating grid-template-rows is supported in current Chrome, Safari and Firefox; older browsers simply snap open and closed, which is functionally identical.',
    implementation: 'State is an array of open indices; single mode replaces it, multiple mode toggles membership, and switching to single trims it so the UI never contradicts the setting. The panel height is animated entirely in CSS, so there is no ResizeObserver or measured pixel value to go stale.',
  },
  component: () => import('./Component'),
});
