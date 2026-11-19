import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'bento-sync-pulse',
  name: 'Sync Pulse Bento',
  description: 'A bento of connected tiles. Hovering or focusing one traces everything downstream of it, and an auto-cycle demonstrates the dependency chain until the user takes over.',
  tags: ['bento', 'dependencies', 'hover', 'focus', 'auto-cycle', 'state'],
  useCases: ['saas-landing', 'product-site', 'documentation'],
  complexity: 'moderate',
  techniques: ['state-machine', 'css-transition', 'pointer-tracking'],
  layouts: ['grid'],
  styles: ['dark', 'technical'],
  scrollDriven: false,
  frameHeight: 520,
  defaults,
  controls: [
    range('gap', 'Gap', 'layout', 4, 32, 2, 'px'),
    range('radius', 'Corner radius', 'style', 0, 36, 1, 'px'),
    select('linkStyle', 'Linked-tile style', 'style', [['glow', 'Glow'], ['outline', 'Dashed outline'], ['fill', 'Fill']]),
    toggle('showLines', 'Connector hint', 'style'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('autoCycle', 'Auto-cycle', 'motion', 'Walks through each tile in turn until the user hovers or focuses one.'),
    range('cycleMs', 'Cycle speed', 'motion', 800, 6000, 100, 'ms'),
  ],
  notes: {
    responsive: 'The three-column layout with a tall Alerts tile becomes two columns and then one, by re-declaring grid-template-areas in container queries. Tile text always wraps within its tile.',
    accessibility: 'Each tile is a real button, so it is reachable by keyboard; focus highlights the same downstream tiles as hover. The relationships are also written out as text (“Updates: Tickets, Warehouse”) and linked with aria-describedby, and the badges say Changed/Synced, so colour is never the only signal.',
    motion: 'The cycle only runs when auto-cycle is on, motion is allowed, the preview is not paused and the user is not hovering or focusing a tile. With reduced motion nothing cycles and transitions are removed; the demo is entirely user-driven.',
    browser: 'CSS grid areas and container queries are supported in all current browsers.',
    implementation: 'The relationships are a small adjacency list; a recursive walk computes the set of downstream nodes for the focused tile, and each tile renders data-source/data-lit from that set. A single piece of state (hover) takes priority over the cycling index, so there is no timer fight.',
  },
  component: () => import('./Component'),
});
