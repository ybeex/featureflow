#!/usr/bin/env node
// Screenshot an app route. node scripts/page.mjs "/explore" [--w 1280] [--h 900] [--full] [--dark] [--out file.png] [--wait ms]
import { chromium } from 'playwright-core';
const a = process.argv.slice(2);
const route = a[0] ?? '/';
const opt = (n, d) => { const i = a.indexOf(`--${n}`); return i >= 0 ? a[i + 1] : d; };
const flag = (n) => a.includes(`--${n}`);
const w = Number(opt('w', 1280)), h = Number(opt('h', 900));
const out = opt('out', '/tmp/ff-shots/page.png');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: flag('dark') ? 'dark' : 'light', reducedMotion: flag('reduced') ? 'reduce' : 'no-preference' });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(`http://127.0.0.1:5173/#${route}`);
await page.waitForTimeout(Number(opt('wait', 1800)));
const scrollY = Number(opt('y', 0));
if (scrollY) { await page.evaluate((y) => window.scrollTo(0, y), scrollY); await page.waitForTimeout(900); }
await page.screenshot({ path: out, fullPage: flag('full') });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
console.log(JSON.stringify({ route, out, overflowX: overflow, errors: [...new Set(errors)] }, null, 2));
await browser.close();
