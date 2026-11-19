import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'bento-live-metrics',
  name: 'Live Metrics Bento',
  description: 'A dashboard-style bento whose numbers and sparklines update on a timer, with colour-coded deltas that account for whether up is good or bad for each metric.',
  tags: ['bento', 'metrics', 'live', 'sparkline', 'dashboard', 'svg'],
  useCases: ['dashboard', 'saas-landing', 'product-site'],
  complexity: 'moderate',
  techniques: ['raf-loop', 'svg', 'state-machine'],
  layouts: ['grid'],
  styles: ['dark', 'technical'],
  scrollDriven: false,
  frameHeight: 540,
  defaults,
  controls: [
    range('pointsShown', 'History length', 'layout', 8, 48, 2, 'points'),
    range('gap', 'Gap', 'layout', 4, 32, 2, 'px'),
    toggle('sparklines', 'Sparklines', 'layout'),
    range('radius', 'Corner radius', 'style', 0, 36, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('tickMs', 'Update interval', 'motion', 400, 4000, 100, 'ms', 'How often a new reading arrives.'),
    range('volatility', 'Volatility', 'motion', 2, 30, 1, '%', 'How far each reading can move from the previous one.'),
  ],
  notes: {
    responsive: 'Four columns become two, then one with container queries; the two wide tiles lose their span when there is no room. Sparklines stretch to the tile width.',
    accessibility: 'Values are text, not canvas, and are not announced on every tick (aria-live is off) to avoid flooding screen readers. Deltas use an arrow, the word Up/Down and hidden “better/worse” text instead of colour alone. A visible Live/Paused status explains the motion.',
    motion: 'Readings update on an interval. With reduced motion, or when the host pauses the preview, updates stop completely and the status reads Paused. The status pulse is removed under reduced motion.',
    browser: 'Plain SVG polylines and CSS grid; supported everywhere. The demo data is simulated: wire the same component to your own source by replacing the interval.',
    implementation: 'Initial history is generated from a small seeded generator so the first render is identical on server and client; random movement only starts after mount. Each tick shifts one value into a fixed-length window per metric. Sparklines use non-scaling strokes so they stay crisp at any width.',
  },
  component: () => import('./Component'),
});
