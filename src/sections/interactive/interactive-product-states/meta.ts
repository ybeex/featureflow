import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'interactive-product-states',
  name: 'Product State Switcher',
  description: 'A working mock product panel that can be flipped between empty, loading, ready and error states, with a real simulated load and a written design note for each.',
  tags: ['interactive', 'states', 'skeleton', 'empty-state', 'error-state', 'product'],
  useCases: ['product-site', 'documentation', 'saas-landing'],
  complexity: 'moderate',
  techniques: ['state-machine', 'css-animation'],
  layouts: ['centered', 'stacked'],
  styles: ['minimal', 'technical'],
  scrollDriven: false,
  frameHeight: 600,
  defaults,
  controls: [
    select('initial', 'Initial state', 'layout', [['ready', 'Ready'], ['empty', 'Empty'], ['loading', 'Loading'], ['error', 'Error']], 'The starting state. Visitors can switch freely.'),
    range('rows', 'Rows', 'layout', 2, 6, 1),
    toggle('annotate', 'Design note', 'layout'),
    select('theme', 'Panel theme', 'style', [['light', 'Light'], ['dark', 'Dark']]),
    range('radius', 'Corner radius', 'style', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('loadMs', 'Simulated load time', 'motion', 400, 5000, 100, 'ms'),
  ],
  notes: {
    responsive: 'The table drops its owner column below ~480px, and skeleton rows drop the same column so the loading layout always matches the loaded one.',
    accessibility: 'The panel carries aria-busy while loading, the error state is role="alert" so it is announced, and the design note is a polite live region. State buttons are a pressed-state group. The skeleton shimmer is decorative and stops under reduced motion.',
    motion: 'The skeleton shimmer is the only animation, and stops under reduced motion; the simulated load still happens, just faster, so the loading → ready transition remains demonstrable.',
    browser: 'Plain CSS and a timer; supported everywhere.',
    implementation: 'State is a single enum rendered by one switch, which is the shape real data-fetching UIs should use: it makes impossible states (loading and error at once) unrepresentable. “Simulate load” and “Try again” share one function that moves loading → ready on a timer, which is cleared on unmount and on manual changes so a stale timer never overwrites a state the visitor chose.',
  },
  component: () => import('./Component'),
});
