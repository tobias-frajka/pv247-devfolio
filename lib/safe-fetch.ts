import 'server-only';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';

export const LINK_CHECK_CONCURRENCY = 5;

export async function isSafeHttpUrl(input: string): Promise<URL | null> {
  if (!input) return null;
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const host = url.hostname;
  const literal = isIP(host);
  const addrs = literal
    ? [{ address: host, family: literal }]
    : await dns.lookup(host, { all: true }).catch(() => null);
  if (!addrs || addrs.length === 0) return null;

  for (const a of addrs) {
    if (a.family === 4 ? isPrivateV4(a.address) : isPrivateV6(a.address)) return null;
  }
  return url;
}

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const worker = async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await fn(items[i] as T, i);
    }
  };
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

function isPrivateV4(addr: string): boolean {
  const parts = addr.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => !Number.isInteger(p) || p < 0 || p > 255)) {
    return true;
  }
  const [a, b] = parts as [number, number, number, number];
  if (a === 0) return true;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a >= 224) return true;
  return false;
}

function isPrivateV6(addr: string): boolean {
  const lower = addr.toLowerCase();
  if (lower === '::' || lower === '::1') return true;
  if (
    lower.startsWith('fe8') ||
    lower.startsWith('fe9') ||
    lower.startsWith('fea') ||
    lower.startsWith('feb')
  ) {
    return true;
  }
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  if (lower.startsWith('ff')) return true;
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateV4(mapped[1] as string);
  return false;
}
