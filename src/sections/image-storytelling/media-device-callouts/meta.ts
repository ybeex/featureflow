import { defineSection } from '../../../registry/define';
import { color, select, toggle, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'media-device-callouts',
  name: 'Device Hotspot Callouts',
  description: 'A laptop or phone mock-up with numbered hotspots. A synced list and live description follow the selection, which auto-tours until the visitor takes over.',
  tags: ['device', 'hotspots', 'callouts', 'annotated', 'tour', 'mockup'],
  useCases: ['product-site', 'saas-landing', 'documentation'],
  complexity: 'moderate',
  techniques: ['state-machine', 'css-animation'],
  layouts: ['split', 'centered'],
  styles: ['minimal'],
  scrollDriven: false,
  frameHeight: 620,
  defaults,
  controls: [
    select('device', 'Device', 'layout', [['laptop', 'Laptop'], ['phone', 'Phone']]),
    toggle('showNumbers', 'Number the hotspots', 'layout'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('autoTour', 'Auto tour', 'motion', 'Steps through the hotspots until the visitor interacts.'),
    range('tourMs', 'Time per hotspot', 'motion', 1200, 8000, 200, 'ms'),
    toggle('pulse', 'Pulse the active hotspot', 'motion'),
  ],
  notes: {
    responsive: 'Hotspot positions are percentages of the screen, so they stay attached to the right regions at any device size and in both device modes. Below ~680px the device moves above the list.',
    accessibility: 'Hotspots and list items are real buttons with aria-pressed; focusing a hotspot selects it and stops the tour. The description is an aria-live region. Hotspots carry hidden text of their name, and the numbers are shown as text, not colour alone.',
    motion: 'The tour pauses on hover, on any interaction and when the preview is paused, and a visible “Resume tour” button restores it. With reduced motion there is no auto-tour or pulse; selection is entirely user-driven.',
    browser: 'Standard CSS and timers; the phone frame is plain CSS.',
    implementation: 'One piece of state (the active index) feeds the hotspots, the list and the description, so the three never disagree. The tour is a single interval that is only created while nothing is stopping it. Replace MockUI with your own screenshot and keep the percent coordinates of its hot regions.',
  },
  component: () => import('./Component'),
});
