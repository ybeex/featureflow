import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'cards-spotlight',
  name: 'Cursor Spotlight Cards',
  description: 'A card grid lit by a shared radial spotlight that follows the pointer, glowing both card borders and faces across card boundaries.',
  tags: ['cards', 'spotlight', 'pointer', 'glow', 'hover', 'grid'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'moderate',
  techniques: ['pointer-tracking', 'css-transition'],
  layouts: ['grid'],
  styles: ['dark', 'gradient'],
  scrollDriven: false,
  frameHeight: 600,
  featured: true,
  defaults,
  controls: [
    range('columns', 'Columns', 'layout', 1, 4, 1),
    range('gap', 'Gap', 'layout', 4, 32, 2, 'px'),
    range('radius', 'Corner radius', 'style', 0, 36, 1, 'px'),
    toggle('borderGlow', 'Border glow', 'style'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('spotlightSize', 'Spotlight size', 'motion', 120, 600, 10, 'px'),
    range('spotlightStrength', 'Spotlight strength', 'motion', 0.05, 0.8, 0.05),
  ],
  notes: {
    responsive: 'The grid drops to two columns and then one with container queries. The spotlight is a hover effect only: on touch devices it is disabled and the cards are simply static.',
    accessibility: 'The effect is decorative: the pseudo-element overlays are pointer-events: none, never carry text, and cards are readable at full contrast without them. Nothing depends on hover.',
    motion: 'The glow follows the pointer directly and fades in and out on enter/leave; with reduced motion the fade is removed. There is no autonomous animation.',
    browser: 'radial-gradient with CSS variables and mix-blend-mode are supported in all current browsers; the effect is skipped on devices without hover.',
    implementation: 'A single pointermove handler on the grid writes each card’s local pointer coordinates to --mx/--my (accounting for transforms by comparing offsetWidth to the measured width). Because the position is relative to each card, the light appears continuous across the gaps. No React state is touched while moving.',
  },
  component: () => import('./Component'),
});
