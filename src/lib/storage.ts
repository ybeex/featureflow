/** localStorage that never throws (private windows, blocked storage, SSR). Falls back to memory. */
const memory = new Map<string, string>();

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw != null) return JSON.parse(raw) as T;
  } catch { /* fall through */ }
  const mem = memory.get(key);
  if (mem != null) {
    try { return JSON.parse(mem) as T; } catch { /* ignore */ }
  }
  return fallback;
}

export function writeJSON(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try { window.localStorage.setItem(key, raw); } catch { /* memory copy still works for this session */ }
}

export function storageAvailable(): boolean {
  try {
    const k = '__ff_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch { return false; }
}
