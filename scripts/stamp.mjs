#!/usr/bin/env node
// Writes a listing hash as the last line of src/registry/index.ts so test runners never reuse a stale glob expansion.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const dir = 'src/sections';
const list = [];
if (existsSync(dir)) for (const c of readdirSync(dir)) for (const s of readdirSync(join(dir, c))) list.push(`${c}/${s}`);
const hash = list.sort().join(',').split('').reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7).toString(36);
const file = 'src/registry/index.ts';
const src = readFileSync(file, 'utf8').replace(/\n\/\/ listing: .*\n?$/, '\n');
const next = `${src.replace(/\n+$/, "\n")}// listing: ${hash} (${list.length}) @${Date.now().toString(36)}\n`;
if (next !== readFileSync(file, 'utf8')) writeFileSync(file, next);
