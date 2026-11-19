import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'stack-numbered-steps',
  name: 'Numbered Step Stack',
  description: 'Dark stacking step cards with outlined numerals and icons, beside a progress rail that fills with real scroll progress and names the active step.',
  tags: ['stack', 'steps', 'numbered', 'progress', 'rail', 'dark'],
  useCases: ['saas-landing', 'documentation', 'product-site'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var', 'intersection-observer'],
  layouts: ['stacked', 'timeline'],
  styles: ['dark', 'editorial'],
  scrollDriven: true,
  posterProgress: 0.38,
  frameHeight: 720,
  defaults,
  controls: [
    range('steps', 'Steps', 'layout', 3, 6, 1),
    toggle('showRail', 'Progress rail', 'layout', 'On narrow containers the rail collapses into a thin sticky progress bar.'),
    range('stickyOffset', 'Sticky offset', 'layout', 0, 120, 2, 'px'),
    range('cardHeight', 'Card height', 'layout', 30, 80, 2, '% of frame'),
    range('stackOffset', 'Stack spacing', 'layout', 4, 36, 1, 'px'),
    range('radius', 'Corner radius', 'layout', 0, 36, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('scaleStep', 'Stack scale', 'motion', 0, 0.08, 0.005, undefined, 'How much each buried card shrinks per card on top of it.'),
  ],
  notes: {
    responsive: 'Below ~640px the side rail becomes a thin sticky progress bar with a “Step n of N” label, cards go single-column and the stack peek shrinks to 10px.',
    accessibility: 'Steps are an ordered list of articles. The rail marks the active step with aria-current="step" and a visible dot plus the text “Step 2 of 5”, so state is not colour-only. Numerals are decorative.',
    motion: 'With reduced motion the cards become a plain list with no pinning, scaling or transitions, and the rail is hidden because it would duplicate the list. Pinning itself is CSS and works without JavaScript.',
    browser: 'position: sticky, container queries and color-mix() are supported in all current browsers.',
    implementation: 'Cards are position: sticky with top = base + index × offset. useScrollVar writes the wrapper’s progress into --ff-p, which scales the rail fill. useActiveIndex (IntersectionObserver) picks the active step; buried cards scale via a CSS variable derived from it.',
  },
  component: () => import('./Component'),
});
