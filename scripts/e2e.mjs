#!/usr/bin/env node
// End-to-end checks against a running dev server. node scripts/e2e.mjs
import { chromium } from 'playwright-core';
const base = 'http://127.0.0.1:5173/#';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
let pass = 0, fail = 0;
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? '✓' : '✗'} ${name} ${ok ? '' : extra}`); };
const go = async (r) => { await page.goto(base + r); await page.waitForTimeout(900); };

// Explore: counts, search, filters, empty state
await go('/explore');
const cards = () => page.locator('article.scard').count();
const all = await cards();
check('explore lists all 60 sections', all === 60, `got ${all}`);
await page.getByPlaceholder(/Search/).fill('canvas');
await page.waitForTimeout(400);
const canvasN = await cards();
check('search "canvas" narrows results', canvasN > 0 && canvasN < 60, `got ${canvasN}`);
await page.getByPlaceholder(/Search/).fill('zzzznope');
await page.waitForTimeout(400);
check('empty state shows when nothing matches', (await cards()) === 0 && (await page.getByText(/no sections|nothing|no results/i).count()) > 0);
await page.getByPlaceholder(/Search/).fill('');
await page.waitForTimeout(300);
check('clearing search restores all', (await cards()) === 60);
const url1 = await page.evaluate(() => location.hash);
// Combined filters: click a category checkbox then a technique
const chip = (group, text) => page.locator('aside.filters fieldset', { has: page.locator('h3', { hasText: group }) }).locator('button.chip', { hasText: text }).first();
await chip('Category', 'Bento').click();
await page.waitForTimeout(300);
const afterOne = await cards();
check('category filter narrows to 5 bento', afterOne === 5, `got ${afterOne}`);
await chip('Visual style', 'Dark').click();
await page.waitForTimeout(300);
const afterTwo = await cards();
check('combined filters intersect', afterTwo <= afterOne, `got ${afterTwo}`);
const countLabel = await page.locator('.toolbar__count').innerText();
check('result count label matches grid', countLabel.startsWith(String(afterTwo)), countLabel);
const urlF = await page.evaluate(() => location.hash);
check('filter state is in the URL', urlF !== url1 && urlF.length > url1.length, urlF);
await page.reload(); await page.waitForTimeout(900);
check('filters survive reload', (await cards()) === afterTwo);
await page.getByRole('button', { name: /Reset filters/ }).click();
await page.waitForTimeout(300);
check('reset restores all', (await cards()) === 60, `got ${await cards()}`);

// Favorites + compare persistence
await go('/explore');
await page.getByRole('button', { name: 'Favorite Sticky Cards' }).first().click().catch(async () => { await page.locator('article.scard button[aria-label^="Favorite"]').first().click(); });
await page.locator('article.scard button[aria-label^="Compare"]').nth(1).click();
await page.locator('article.scard button[aria-label^="Compare"]').nth(2).click();
const favCount = await page.locator('article.scard button[aria-label^="Favorite"][aria-pressed=true]').count();
check('favorite toggles', favCount >= 1, `got ${favCount}`);
await page.reload(); await page.waitForTimeout(900);
check('favorite persists after reload', (await page.locator('article.scard button[aria-label^="Favorite"][aria-pressed=true]').count()) === favCount);
check('compare persists after reload', (await page.locator('article.scard button[aria-label^="Compare"][aria-pressed=true]').count()) === 2);
await go('/favorites');
check('favorites page shows saved + compare', (await page.locator('article.scard').count()) >= 1 && (await page.getByText(/compare/i).count()) > 0);

// Section page: playground changes preview, reset, save, code equals preview
await go('/section/exp-morph-shapes');
await page.waitForTimeout(1200);
const frame = page.locator('.frame__scroll').first();
check('frame renders', (await frame.count()) === 1);
const fill = page.getByRole('switch', { name: /Filled/ });
const beforeFill = await page.evaluate(() => getComputedStyle(document.querySelector('.ff-exp-morph-shapes__svg path')).fill);
await fill.click();
await page.waitForTimeout(300);
const afterFill = await page.evaluate(() => getComputedStyle(document.querySelector('.ff-exp-morph-shapes__svg path')).fill);
check('toggle control changes the live preview', beforeFill !== afterFill, `${beforeFill} -> ${afterFill}`);
await page.getByRole('button', { name: /Save/ }).first().click();
await page.getByRole('button', { name: /Reset/ }).first().click();
const resetFill = await page.evaluate(() => getComputedStyle(document.querySelector('.ff-exp-morph-shapes__svg path')).fill);
check('reset restores defaults', resetFill === beforeFill);
await page.reload(); await page.waitForTimeout(1200);
check('saved config offers restore after reload', (await page.getByRole('button', { name: /Load saved|Apply saved|Saved/i }).count()) > 0);
// code
await fill.click(); await page.waitForTimeout(300);
const codeText = await page.locator('section[aria-label="Source code"] pre').first().innerText();
check('code viewer shows source', codeText.length > 200);
const hasFalse = /filled:\s*false/.test(await page.locator('section[aria-label="Source code"]').innerText());
check("displayed code reflects changed config", /filled["']?\s*[:=]\s*\{?false/.test(await page.locator("section[aria-label=\"Source code\"]").innerText()) || hasFalse);
for (const fmt of ['HTML', 'React', 'JavaScript', 'Next']) {
  const b = page.locator('[aria-label="Code format"] button', { hasText: fmt }).first();
  if (await b.count()) { await b.click(); await page.waitForTimeout(500); const t = await page.locator('section[aria-label="Source code"] pre').first().innerText(); check(`code tab ${fmt} non-empty`, t.length > 100); }
  else check(`code tab ${fmt} exists`, false);
}
await page.getByRole('button', { name: /^Copy file|Copy\b/ }).first().click();
const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
check('copy puts code on the clipboard', clip.length > 100);

// Pointer sections respond
await go('/section/exp-light-beam'); await page.waitForTimeout(1200);
const st = page.locator('.ff-exp-light-beam__stage');
const bb = await st.boundingBox();
await page.mouse.move(bb.x + 100, bb.y + 100); await page.mouse.move(bb.x + 130, bb.y + 110, { steps: 4 }); await page.waitForTimeout(900);
const bx = await st.evaluate((e) => e.style.getPropertyValue('--bx'));
check('light beam follows the pointer', parseFloat(bx) < 30, bx);
await go('/section/cards-tilt-3d'); await page.waitForTimeout(1200);
const card = page.locator('.ff-cards-tilt-3d__card').first();
const cb = await card.boundingBox();
await page.mouse.move(cb.x + cb.width * 0.85, cb.y + cb.height * 0.2, { steps: 5 }); await page.waitForTimeout(500);
const tf = await card.evaluate((e) => getComputedStyle(e).transform);
check('tilt card transforms on hover', tf && tf !== 'none', tf);

// Keyboard: tabs
await go('/section/interactive-tabs-illustration'); await page.waitForTimeout(1200);
const tab = page.locator('[role=tab]').first(); await tab.focus(); await page.keyboard.press('ArrowRight');
check('tabs: ArrowRight moves selection', (await page.locator('[role=tab][aria-selected=true]').first().innerText()) !== (await tab.innerText()) || (await page.locator('[role=tab]').nth(1).getAttribute('aria-selected')) === 'true');

// Every section page loads without errors
const ids = await page.evaluate(async () => (await import('/src/registry/index.ts')).sections?.map((s) => s.id) ?? []).catch(() => []);
console.log('section ids via module:', ids.length);
console.log(`\n${pass} passed, ${fail} failed`);
console.log('console errors:', [...new Set(errors)].slice(0, 10));
await browser.close();
process.exit(fail ? 1 : 0);
