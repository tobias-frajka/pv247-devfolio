'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { profile as profileTable, project, social } from '@/db/schema';
import { requireUsername } from '@/lib/dal';
import { isSafeHttpUrl, LINK_CHECK_CONCURRENCY, mapWithConcurrency } from '@/lib/safe-fetch';

export type LinkStatus = 'ok' | 'broken' | 'server-error' | 'unreachable';
export type LinkSource = 'project' | 'social' | 'profile';
export type LinkResult = {
  url: string;
  status: LinkStatus;
  source: LinkSource;
  label: string;
  targetId: string;
  httpStatus?: number;
};

const TIMEOUT_MS = 5000;

async function pingOnce(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'manual'
    });
  } finally {
    clearTimeout(timer);
  }
}

async function pingUrl(url: string): Promise<{ status: LinkStatus; httpStatus?: number }> {
  const safe = await isSafeHttpUrl(url);
  if (!safe.ok) return { status: 'unreachable' };
  try {
    let res = await pingOnce(safe.url.toString(), 'HEAD');
    if (res.status === 405 || res.status === 501) {
      res = await pingOnce(safe.url.toString(), 'GET');
    }
    if (res.status >= 200 && res.status < 400) return { status: 'ok', httpStatus: res.status };
    if (res.status >= 400 && res.status < 500) return { status: 'broken', httpStatus: res.status };
    return { status: 'server-error', httpStatus: res.status };
  } catch {
    return { status: 'unreachable' };
  }
}

export async function checkLinks(): Promise<LinkResult[]> {
  const session = await requireUsername();
  const userId = session.user.id;

  const [projects, socials, profile] = await Promise.all([
    db.query.project.findMany({ where: eq(project.userId, userId) }),
    db.query.social.findMany({ where: eq(social.userId, userId) }),
    db.query.profile.findFirst({ where: eq(profileTable.userId, userId) })
  ]);

  const targets: { url: string; source: LinkSource; label: string; targetId: string }[] = [];

  for (const p of projects) {
    if (p.githubUrl)
      targets.push({
        url: p.githubUrl,
        source: 'project',
        label: `${p.title} · GitHub`,
        targetId: p.id
      });
    if (p.liveUrl)
      targets.push({
        url: p.liveUrl,
        source: 'project',
        label: `${p.title} · Live`,
        targetId: p.id
      });
  }
  for (const s of socials) {
    if (s.platform === 'email') continue;
    targets.push({ url: s.url, source: 'social', label: s.platform, targetId: s.platform });
  }
  if (profile?.avatarUrl) {
    targets.push({
      url: profile.avatarUrl,
      source: 'profile',
      label: 'Avatar',
      targetId: 'avatar'
    });
  }

  return mapWithConcurrency(targets, LINK_CHECK_CONCURRENCY, async t => {
    const { status, httpStatus } = await pingUrl(t.url);
    return { ...t, status, httpStatus };
  });
}
