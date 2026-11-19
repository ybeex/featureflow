import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'stack-perspective-depth',
  name: 'Perspective Depth Stack',
  description: 'A pinned stage holds a 3D deck of feature cards. The front card lifts away as you scroll and every card behind steps one place closer.',
  tags: ['stack', '3d', 'perspective', 'pinned', 'depth', 'cards'],
  useCases: ['saas-landing', 'product-site'],
  complexity: 'advanced',
  techniques: ['css-sticky', 'scroll-var'],
  layouts: ['split', 'layered'],
  styles: ['dark', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.3,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('cardCount', 'Cards', 'layout', 3, 6, 1),
    range('radius', 'Corner radius', 'layout', 0, 40, 1, 'px'),
    range('perspective', 'Perspective', 'motion', 400, 2400, 20, 'px', 'Distance of the camera. Lower values exaggerate depth.'),
    range('depthStep', 'Depth step', 'motion', 20, 160, 2, 'px', 'How far each card sits behind the one in front.'),
    range('tilt', 'Tilt (rotateX)', 'motion', 0, 30, 1, 'deg'),
    range('fade', 'Depth fade', 'motion', 0, 0.4, 0.02, undefined, 'Opacity lost per step of depth.'),
    range('scrollLength', 'Scroll length', 'motion', 2, 8, 0.5, 'screens', 'Height of the pinned span in scroller heights.'),
    color('background', 'Background'),
    color('surface', 'Card'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'Below ~720px the copy stacks above the deck, the illustration inside each card is dropped and the pinned span is capped at three screens so the stage never holds the page for long.',
    accessibility: 'Cards are an ordered list in reading order and every card stays in the DOM. A visible “Card 2 of 5” counter names the front card in text, so position is not conveyed by depth alone. Text contrast is above 4.5:1 on the card surface.',
    motion: 'With prefers-reduced-motion, without JavaScript, and in server-rendered output the deck is a plain vertical list with no pinning, transforms or fading. The 3D stage is armed only after mount.',
    browser: 'Needs CSS perspective, preserve-3d and min()/max()/clamp() inside calc(), supported in all current browsers. color-mix() falls back to the plain card colour.',
    implementation: 'useScrollVar writes one variable, --ff-p, on the tall track. Each card derives its signed distance from the front, d = i − p·(n−1), in CSS calc() and splits it with min()/max() into “behind” and “already lifted”. Behind cards get translateZ, rise, rotateX and an opacity falloff; lifted ones translate up and fade out. Only transform and opacity change.',
  },
  component: () => import('./Component'),
});
