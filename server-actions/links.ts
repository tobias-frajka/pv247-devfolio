'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { project, social } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

export type LinkStatus = 'ok' | 'broken' | 'server-error' | 'unreachable';
export type LinkSource = 'project' | 'social';
export type LinkResult = {
  url: string;
  status: LinkStatus;
  source: LinkSource;
  label: string;
};

const TIMEOUT_MS = 5000;

async function pingOnce(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow'
    });
  } finally {
    clearTimeout(timer);
  }
}

async function pingUrl(url: string): Promise<LinkStatus> {
  try {
    let res = await pingOnce(url, 'HEAD');
    if (res.status === 405 || res.status === 501) {
      res = await pingOnce(url, 'GET');
    }
    if (res.status >= 200 && res.status < 400) return 'ok';
    if (res.status >= 400 && res.status < 500) return 'broken';
    return 'server-error';
  } catch {
    return 'unreachable';
  }
}

export async function checkLinks(): Promise<LinkResult[]> {
  const session = await requireUsername();
  const userId = session.user.id;

  const [projects, socials] = await Promise.all([
    db.query.project.findMany({ where: eq(project.userId, userId) }),
    db.query.social.findMany({ where: eq(social.userId, userId) })
  ]);

  const targets: { url: string; source: LinkSource; label: string }[] = [];

  for (const p of projects) {
    if (p.githubUrl)
      targets.push({ url: p.githubUrl, source: 'project', label: `${p.title} · GitHub` });
    if (p.liveUrl) targets.push({ url: p.liveUrl, source: 'project', label: `${p.title} · Live` });
  }
  for (const s of socials) {
    if (s.platform === 'email') continue;
    targets.push({ url: s.url, source: 'social', label: s.platform });
  }

  return Promise.all(targets.map(async t => ({ ...t, status: await pingUrl(t.url) })));
}
