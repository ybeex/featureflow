import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'exp-light-beam',
  name: 'Pointer Light Beam',
  description: 'A soft beam of light follows the pointer across real text: everything outside it is dimmed. On touch screens and when idle it sweeps by itself. The copy is always fully present and readable underneath.',
  tags: ['experimental', 'spotlight', 'pointer', 'mask', 'text', 'light'],
  useCases: ['agency', 'portfolio', 'product-site'],
  complexity: 'moderate',
  techniques: ['pointer-tracking', 'raf-loop'],
  layouts: ['centered', 'grid'],
  styles: ['dark', 'editorial'],
  scrollDriven: false,
  frameHeight: 600,
  defaults,
  controls: [
    range('radius', 'Beam radius', 'layout', 80, 420, 10, 'px'),
    range('softness', 'Edge softness', 'style', 0.1, 1, 0.05),
    range('ambient', 'Ambient light', 'style', 0.15, 0.7, 0.02, '', 'How visible the text is outside the beam.'),
    color('tint', 'Light tint'),
    color('textColor', 'Text'),
    range('smoothing', 'Follow smoothing', 'motion', 0.04, 0.5, 0.01, '', 'Lower values trail the pointer more.'),
    toggle('autoSweep', 'Sweep when idle', 'motion'),
    range('sweepSpeed', 'Sweep speed', 'motion', 0.2, 3, 0.1, '×'),
  ],
  notes: {
    responsive: 'The beam radius is in pixels so it keeps a constant size as the frame changes; the three columns of copy reflow with auto-fit grid. Touch devices get the idle sweep because there is no hover.',
    accessibility: 'No text is hidden or duplicated: the shade layer is aria-hidden, pointer-events none, and only reduces visual brightness. Ambient light defaults to a level that stays readable for most people, but at low values the dimmed copy will fail contrast: keep Ambient light above about 0.35 for body text. Reduced motion removes the shade completely and shows the copy at full brightness.',
    motion: 'The beam eases toward the pointer each frame with an adjustable lerp, and sweeps along a Lissajous path when idle. Pause and reduced motion stop the loop and rest the beam at centre.',
    browser: 'radial-gradient and color-mix() in the shade layer; all current browsers. One rAF loop writes two CSS variables; there is no layout work per frame.',
    implementation: 'The shade is a single absolutely-positioned layer with a radial gradient whose centre is --bx/--by and whose outer colour is the background at (1 - ambient) opacity. The loop only updates those two variables, so the text itself is never re-rendered or masked.',
  },
  component: () => import('./Component'),
});
