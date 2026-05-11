import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

import { cookies, headers } from 'next/headers';

import type { StarIdentityKind } from '@/db/schema/star';
import { getSession } from '@/lib/dal';

const ANON_COOKIE = 'df_anon';
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type StarIdentity =
  | { kind: Extract<StarIdentityKind, 'user'>; key: string; userId: string }
  | { kind: Extract<StarIdentityKind, 'anon'>; key: string }
  | { kind: Extract<StarIdentityKind, 'ip'>; key: string };

async function ipHashIdentity(): Promise<StarIdentity> {
  const h = await headers();
  const ip =
    (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? '').split(',')[0].trim() || 'unknown';
  const ua = h.get('user-agent') ?? 'unknown';
  const secret = process.env.STARS_IDENTITY_SECRET ?? '';
  const hash = createHash('sha256').update(`${ip}|${ua}|${secret}`).digest('hex');
  return { kind: 'ip', key: `ip:${hash}` };
}

// When mint=false (RSC reads), an anonymous visitor without a cookie falls
// back to an IP+UA hash so we can still answer "has this visitor starred?".
// When mint=true (server action), a new anon cookie is set so the inserted
// row and all subsequent reads agree on the same identity.
export async function getStarIdentity({ mint }: { mint: boolean }): Promise<StarIdentity> {
  const session = await getSession();
  if (session?.user?.id) {
    return { kind: 'user', key: `user:${session.user.id}`, userId: session.user.id };
  }

  const cookieStore = await cookies();
  const existing = cookieStore.get(ANON_COOKIE)?.value;
  if (existing) return { kind: 'anon', key: `anon:${existing}` };

  if (!mint) return ipHashIdentity();

  const id = randomBytes(16).toString('hex');
  cookieStore.set(ANON_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ANON_COOKIE_MAX_AGE
  });
  return { kind: 'anon', key: `anon:${id}` };
}
