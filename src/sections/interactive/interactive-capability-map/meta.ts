import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'interactive-capability-map',
  name: 'Interactive Capability Map',
  description: 'An SVG node map of platform capabilities grouped into three areas, with a filter, keyboard-navigable nodes, highlighted relationships and a live detail panel.',
  tags: ['interactive', 'svg', 'map', 'graph', 'filter', 'keyboard'],
  useCases: ['product-site', 'documentation', 'saas-landing'],
  complexity: 'advanced',
  techniques: ['svg', 'state-machine'],
  layouts: ['split', 'centered'],
  styles: ['dark', 'technical'],
  scrollDriven: false,
  frameHeight: 620,
  defaults,
  controls: [
    select('filter', 'Initial area', 'layout', [['all', 'All'], ['build', 'Build'], ['run', 'Run'], ['secure', 'Secure']], 'The starting filter. Visitors can change it with the buttons.'),
    range('nodeSize', 'Node size', 'layout', 20, 48, 1, 'px'),
    toggle('showLabels', 'Node labels', 'style'),
    toggle('showLinks', 'Relationship lines', 'style'),
    range('radius', 'Panel radius', 'style', 0, 36, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'The map is an SVG with a viewBox, so it scales to the container; the detail panel moves below it under ~640px. Labels are in SVG units and scale with the map.',
    accessibility: 'Nodes are focusable role="button" elements with aria-pressed and a label that includes their area; Arrow, Home, End and Enter/Space operate them with a roving tabindex. The detail panel is aria-live. Colour is a secondary cue: the area is also printed in text, and linked nodes get a dashed ring.',
    motion: 'Only short colour and stroke transitions, removed under reduced motion. Nothing moves on its own.',
    browser: 'Inline SVG and CSS transitions on SVG properties are supported in all current browsers.',
    implementation: 'Node coordinates are computed from the group and index (each group owns a 120° arc of a ring), so adding a capability needs data only, not hand-placed positions. Filtered-out nodes fade, are removed from the tab order and aria-hidden, and the selection jumps to the first visible node of the chosen area so a hidden node is never selected.',
  },
  component: () => import('./Component'),
});
