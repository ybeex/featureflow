#!/usr/bin/env node
// Screenshot + probe one section in the dev harness.
//   node scripts/shot.mjs <section-id> [--at 0,0.5,1] [--w 1200] [--h 720] [--reduced] [--cfg '{"k":1}'] [--out DIR] [--base http://127.0.0.1:5173]
// Prints JSON: console errors, scroll height, horizontal overflow, and per-position screenshot paths.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const id = args[0];
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const flag = (name) => args.includes(`--${name}`);
if (!id) { console.error('usage: shot.mjs <section-id> [options]'); process.exit(1); }

const base = opt('base', 'http://127.0.0.1:5173');
const w = Number(opt('w', 1200)), h = Number(opt('h', 720));
const stops = opt('at', '0,0.5,1').split(',').map(Number);
const out = opt('out', '/tmp/ff-shots');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: w + 40, height: h + 40 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

const url = `${base}/harness.html?id=${id}&w=${w}&h=${h}${flag('reduced') ? '&reduced=1' : ''}${flag('paused') ? '&paused=1' : ''}${opt('cfg') ? `&cfg=${encodeURIComponent(opt('cfg'))}` : ''}`;
await page.goto(url);
await page.waitForFunction(() => window.__ffReady === true, null, { timeout: 15000 }).catch(() => errors.push('harness never became ready'));
await page.waitForTimeout(400);

const metrics = await page.evaluate(() => {
  const s = document.getElementById('scroller');
  return { scrollHeight: s.scrollHeight, clientHeight: s.clientHeight, overflowX: s.scrollWidth > s.clientWidth + 1, docOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
});
const shots = [];
for (const p of stops) {
  await page.evaluate((p) => { const s = document.getElementById('scroller'); s.scrollTop = p * (s.scrollHeight - s.clientHeight); }, p);
  await page.waitForTimeout(flag('slow') ? 1200 : 700);
  const file = `${out}/${id}-${w}x${h}-${String(p).replace('.', '_')}${flag('reduced') ? '-reduced' : ''}.png`;
  await page.locator('#scroller').screenshot({ path: file });
  shots.push(file);
}
await browser.close();
console.log(JSON.stringify({ id, url, ...metrics, errors: [...new Set(errors)], shots }, null, 2));
