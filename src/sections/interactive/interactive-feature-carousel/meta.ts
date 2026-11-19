import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'interactive-feature-carousel',
  name: 'Focus Carousel With Swipe',
  description: 'A centre-focused carousel with scaled, faded side slides, pointer drag and swipe, arrow keys, dots, optional looping and an autoplay that can be paused.',
  tags: ['interactive', 'carousel', 'swipe', 'drag', 'autoplay', 'coverflow'],
  useCases: ['saas-landing', 'product-site', 'portfolio'],
  complexity: 'advanced',
  techniques: ['pointer-tracking', 'css-transition', 'state-machine'],
  layouts: ['track', 'centered'],
  styles: ['dark', 'minimal'],
  scrollDriven: false,
  frameHeight: 560,
  defaults,
  controls: [
    range('cardWidth', 'Slide width', 'layout', 40, 80, 1, '%'),
    toggle('loop', 'Loop around', 'layout'),
    range('radius', 'Corner radius', 'style', 0, 40, 1, 'px'),
    range('sideScale', 'Side slide scale', 'style', 0.5, 1, 0.01),
    range('sideOpacity', 'Side slide opacity', 'style', 0.1, 1, 0.05),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('autoplay', 'Autoplay', 'motion', 'Advances automatically. Pauses on hover, while dragging, and when the visitor presses the pause button.'),
    range('intervalMs', 'Autoplay interval', 'motion', 2000, 10000, 500, 'ms'),
  ],
  notes: {
    responsive: 'On narrow containers the active slide widens to 78% of the width so a sliver of each neighbour still hints at swiping. Slides further than one step away are hidden entirely.',
    accessibility: 'Follows the WAI-ARIA carousel pattern: roledescription carousel/slide, “n of N” labels, Arrow/Home/End on the focusable viewport, labelled prev/next/dot buttons, and only the active slide exposed to assistive tech. Autoplay has a pause control (WCAG 2.2.2), pauses on hover and while dragging, and is off under reduced motion.',
    motion: 'Slides move with a transform transition; during a drag the transition is disabled so slides follow the pointer exactly. With reduced motion there is no autoplay and no transition.',
    browser: 'Pointer events with setPointerCapture, min()/max() inside calc() and transforms are supported in current browsers. touch-action: pan-y keeps vertical page scrolling working while horizontal swipes are captured.',
    implementation: 'Every slide shares one anchor position and is offset by its signed distance from the active index (wrapped to the shortest way round when looping), so one CSS rule produces position, scale and opacity from a single --off variable. A drag adds a live pixel offset and commits to the next or previous slide when it passes a threshold.',
  },
  component: () => import('./Component'),
});
