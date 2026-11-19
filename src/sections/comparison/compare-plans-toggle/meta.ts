import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'compare-plans-toggle',
  name: 'Plans With Billing Toggle',
  description: 'Three pricing plans with an accessible monthly/yearly switch. Prices ease to their new values, the discount is configurable, and one plan is featured.',
  tags: ['comparison', 'pricing', 'toggle', 'switch', 'plans', 'animation'],
  useCases: ['pricing', 'saas-landing'],
  complexity: 'moderate',
  techniques: ['state-machine', 'raf-loop'],
  layouts: ['grid'],
  styles: ['minimal', 'playful'],
  scrollDriven: false,
  frameHeight: 680,
  defaults,
  controls: [
    select('billing', 'Billing period', 'layout', [['monthly', 'Monthly'], ['yearly', 'Yearly']], 'The starting state. Visitors can still flip it with the switch.'),
    select('featured', 'Featured plan', 'layout', [['starter', 'Starter'], ['growth', 'Growth'], ['scale', 'Scale']]),
    select('currency', 'Currency symbol', 'layout', [['$', '$'], ['€', '€'], ['£', '£']]),
    range('yearlyDiscount', 'Yearly discount', 'layout', 0, 40, 1, '%'),
    range('radius', 'Corner radius', 'style', 0, 36, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('animatePrice', 'Animate price changes', 'motion'),
  ],
  notes: {
    responsive: 'Three columns become a single column of up to 26rem below ~760px, with the featured plan moved to the top so it is seen first.',
    accessibility: 'The switch is a real button with role="switch" and aria-checked, labelled by the visible “Monthly” text and described by the savings sentence, which updates with the state. The animated number is aria-hidden and a static text equivalent is provided, so screen readers never hear a counting sequence.',
    motion: 'Prices ease with a short rAF tween and the switch thumb slides. With reduced motion, or with the toggle off, values change instantly and no transitions run.',
    browser: 'Standard CSS and requestAnimationFrame; supported everywhere.',
    implementation: 'The yearly price is the monthly price × (1 − discount), rounded, and the yearly total shown is derived from it so the two always agree. The tween hook keeps its current value in a ref, so flipping the switch mid-animation starts from where the number is now rather than jumping.',
  },
  component: () => import('./Component'),
});
