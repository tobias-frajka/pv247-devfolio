import 'server-only';

import { and, eq, type Column, type SQL } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth, type Session } from '@/lib/auth';

// Better Auth throws FAILED_TO_GET_SESSION on any internal error (DB outage,
// libsql I/O hiccup, etc.) — including the case where its own findSession query
// errors. We don't want a transient backend issue to render a 500; treating it
// as "no session" sends the user to /login, which is the right fallback.
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    console.error('[dal] auth.api.getSession failed; treating as unauthenticated', err);
    return null;
  }
});

export const requireSession = cache(async (): Promise<Session> => {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
});

export type SessionWithUsername = Session & {
  user: Session['user'] & { username: string };
};

export const requireUsername = cache(async (): Promise<SessionWithUsername> => {
  const session = await requireSession();
  if (!session.user.username) redirect('/onboarding');
  return session as SessionWithUsername;
});

export const requireOwnership = async <T extends { userId: string }>(
  entity: T | undefined | null,
  fallback = '/dashboard'
): Promise<{ session: Session; entity: T }> => {
  const session = await requireSession();
  if (!entity) redirect(fallback);
  if (entity.userId !== session.user.id) {
    throw new Error('Forbidden');
  }
  return { session, entity };
};

export const byOwner = (table: { id: Column; userId: Column }, id: string, userId: string): SQL =>
  and(eq(table.id, id), eq(table.userId, userId)) as SQL;
