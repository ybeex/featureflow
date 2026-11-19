#!/usr/bin/env node
// Batch check: node scripts/batch.mjs id1 id2 ... [--at 0.1,0.5,0.95] [--w 1200] [--h 720] [--mobile] [--reduced] [--tag name]
// For every id: console errors, horizontal overflow, scroll height; then one contact sheet per id (positions side by side).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const a = process.argv.slice(2);
const ids = a.filter((x, i) => !x.startsWith('--') && !(a[i - 1] ?? '').startsWith('--') || ['--mobile', '--reduced'].includes(a[i - 1] ?? '') && !x.startsWith('--'));
const opt = (n, d) => { const i = a.indexOf(`--${n}`); return i >= 0 ? a[i + 1] : d; };
const flag = (n) => a.includes(`--${n}`);
const mobile = flag('mobile');
const w = Number(opt('w', mobile ? 420 : 1200)), h = Number(opt('h', 720));
const stops = opt('at', '0.05,0.5,0.95').split(',').map(Number);
const tag = opt('tag', mobile ? 'm' : flag('reduced') ? 'r' : 'd');
const out = '/tmp/ff-shots/b'; mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
const report = [];
for (const id of ids) {
  const page = await browser.newPage({ viewport: { width: w + 20, height: h + 20 } });
  const errors = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160)));
  const url = `http://127.0.0.1:5173/harness.html?id=${id}&w=${w}&h=${h}${flag('reduced') ? '&reduced=1' : ''}`;
  let m = { scrollHeight: 0, overflowX: false };
  const files = [];
  try {
    await page.goto(url);
    await page.waitForFunction(() => window.__ffReady === true, null, { timeout: 15000 });
    await page.waitForTimeout(500);
    m = await page.evaluate(() => { const s = document.getElementById('scroller'); return { scrollHeight: s.scrollHeight, overflowX: s.scrollWidth > s.clientWidth + 1 }; });
    for (const p of stops) {
      await page.evaluate((p) => { const s = document.getElementById('scroller'); s.scrollTop = p * (s.scrollHeight - s.clientHeight); }, p);
      await page.waitForTimeout(650);
      const f = `${out}/${id}-${tag}-${String(p).replace('.', '_')}.png`;
      await page.locator('#scroller').screenshot({ path: f });
      files.push(f);
    }
    execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs = sys.argv[2:]
ims = [Image.open(f).convert('RGB') for f in fs]
k = ${mobile ? 0.55 : 0.5}
ims = [i.resize((int(i.width*k), int(i.height*k))) for i in ims]
W = sum(i.width for i in ims) + 6*(len(ims)-1); H = max(i.height for i in ims)
s = Image.new('RGB', (W, H), (120,120,120)); x = 0
for i in ims: s.paste(i, (x, 0)); x += i.width + 6
s.save(sys.argv[1])
`, `${out}/${id}-${tag}-sheet.png`, ...files]);
  } catch (e) { errors.push('FAILED: ' + String(e.message).split('\n')[0]); }
  report.push({ id, scrollHeight: m.scrollHeight, overflowX: m.overflowX, errors: [...new Set(errors)] });
  await page.close();
}
await browser.close();
for (const r of report) console.log(`${r.overflowX || r.errors.length ? '✗' : '✓'} ${r.id}  h=${r.scrollHeight}${r.overflowX ? '  OVERFLOW-X' : ''}${r.errors.length ? '  ' + r.errors.join(' | ') : ''}`);
console.log(`sheets: ${out}/<id>-${tag}-sheet.png`);
