import { useEffect, useId, useState, type CSSProperties } from 'react';
import { BrowserFrame, MockUI } from '../../../ff/Mock';
import { useReducedMotion } from '../../../ff/useReducedMotion';
import type { SectionProps } from '../../../ff/types';
import { defaults, type MediaDeviceCalloutsConfig } from './config';
import '../../../ff/base.css';
import './styles.css';

// Hotspot positions are percentages of the device screen, per device, so they stay attached at any size.
const SPOTS = {
  laptop: [
    { x: 14, y: 40, t: 'Navigation', d: 'Jump between projects without leaving the page.' },
    { x: 46, y: 20, t: 'Key numbers', d: 'Revenue, active users and churn, always in view.' },
    { x: 62, y: 52, t: 'Trend chart', d: 'Hover any point to see what changed that day.' },
    { x: 56, y: 82, t: 'Recent activity', d: 'Every update, with who made it and why.' },
  ],
  phone: [
    { x: 50, y: 12, t: 'Channel header', d: 'See who is in the conversation at a glance.' },
    { x: 34, y: 42, t: 'Thread', d: 'Replies stay attached to the message they answer.' },
    { x: 66, y: 62, t: 'Inline actions', d: 'Approve or assign without opening the item.' },
    { x: 50, y: 90, t: 'Composer', d: 'Slash commands run the same automations as the web app.' },
  ],
} as const;

export default function MediaDeviceCallouts({ config, reducedMotion, paused, className }: SectionProps<MediaDeviceCalloutsConfig>) {
  const c = { ...defaults, ...config };
  const reduced = useReducedMotion(reducedMotion);
  const uid = useId();
  const spots = SPOTS[c.device];
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => setActive(0), [c.device]);
  const touring = c.autoTour && !touched && !hover && !reduced && !paused;
  useEffect(() => {
    if (!touring) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % spots.length), Math.max(1200, c.tourMs));
    return () => window.clearInterval(id);
  }, [touring, c.tourMs, spots.length]);

  const style = { '--ff-bg': c.background, '--ff-fg': c.textColor, '--ff-accent': c.accent } as CSSProperties;
  const screen = (
    <div className="ff-media-device-callouts__screen" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <MockUI variant={c.device === 'laptop' ? 'dashboard' : 'chat'} label="Product screenshot" />
      {spots.map((s, i) => (
        <button key={s.t} type="button" className="ff-media-device-callouts__spot" data-active={i === active || undefined} data-pulse={(c.pulse && !reduced && !paused) || undefined}
          style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-pressed={i === active} aria-describedby={`${uid}-d`}
          onClick={() => { setTouched(true); setActive(i); }} onFocus={() => { setTouched(true); setActive(i); }}>
          <span aria-hidden="true">{c.showNumbers ? i + 1 : ''}</span>
          <span className="ff-visually-hidden">{s.t}</span>
        </button>
      ))}
    </div>
  );
  return (
    <section className={`ff-root ff-media-device-callouts ${className ?? ''}`} style={style} data-device={c.device} aria-labelledby={`${uid}-h`}>
      <div className="ff-media-device-callouts__inner">
        <div className="ff-media-device-callouts__text">
          <p className="ff-media-device-callouts__eyebrow">Inside the product</p>
          <h2 id={`${uid}-h`}>Four details you will use every day</h2>
          <ol className="ff-media-device-callouts__list">
            {spots.map((s, i) => (
              <li key={s.t} data-active={i === active || undefined}>
                <button type="button" onClick={() => { setTouched(true); setActive(i); }} aria-pressed={i === active}><b>{i + 1}</b><span>{s.t}</span></button>
              </li>
            ))}
          </ol>
          <p id={`${uid}-d`} className="ff-media-device-callouts__desc" aria-live="polite"><strong>{spots[active].t}.</strong> {spots[active].d}</p>
          {c.autoTour && touched && <button type="button" className="ff-media-device-callouts__resume" onClick={() => setTouched(false)}>Resume tour</button>}
        </div>
        <div className="ff-media-device-callouts__device">
          {c.device === 'laptop' ? <BrowserFrame title="app.lumen.example">{screen}</BrowserFrame> : <div className="ff-media-device-callouts__phone"><i aria-hidden="true" />{screen}</div>}
        </div>
      </div>
    </section>
  );
}
