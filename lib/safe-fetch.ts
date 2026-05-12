import 'server-only';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';

import { safeHttpUrl } from '@/lib/safe-url';

export const LINK_CHECK_CONCURRENCY = 5;

export type SafeUrlCheck = { ok: true; url: URL } | { ok: false };

export async function isSafeHttpUrl(input: string): Promise<SafeUrlCheck> {
  const safe = safeHttpUrl(input);
  if (!safe) return { ok: false };
  const url = new URL(safe);

  const host = url.hostname;
  const literal = isIP(host);
  const addrs = literal
    ? [{ address: host, family: literal }]
    : await dns.lookup(host, { all: true }).catch(() => null);
  if (!addrs || addrs.length === 0) return { ok: false };

  for (const a of addrs) {
    if (a.family === 4 ? isPrivateV4(a.address) : isPrivateV6(a.address)) {
      return { ok: false };
    }
  }
  return { ok: true, url };
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
  if (a === 0) return true; // unspecified / current network
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a >= 224) return true; // multicast + reserved + broadcast (incl. 255.255.255.255)
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
    return true; // fe80::/10 link-local
  }
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // fc00::/7 unique-local
  if (lower.startsWith('ff')) return true; // ff00::/8 multicast
  // IPv4-mapped: ::ffff:a.b.c.d
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateV4(mapped[1] as string);
  return false;
}
