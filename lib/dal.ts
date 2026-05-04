import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth, type Session } from '@/lib/auth';

export const getSession = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({ headers: await headers() });
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
