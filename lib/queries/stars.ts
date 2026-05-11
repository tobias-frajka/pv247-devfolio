import 'server-only';

import { and, count, desc, eq, gt, inArray, isNotNull } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { profileStar } from '@/db/schema/star';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export type StarContext = {
  count: number;
  viewerHasStarred: boolean;
  canStar: boolean;
};

export const getStarCount = cache(async (profileUserId: string): Promise<number> => {
  const [row] = await db
    .select({ n: count() })
    .from(profileStar)
    .where(eq(profileStar.profileUserId, profileUserId));
  return row?.n ?? 0;
});

export const hasStarred = cache(
  async (profileUserId: string, identityKey: string): Promise<boolean> => {
    const row = await db.query.profileStar.findFirst({
      where: and(
        eq(profileStar.profileUserId, profileUserId),
        eq(profileStar.identityKey, identityKey)
      ),
      columns: { id: true }
    });
    return Boolean(row);
  }
);

export const getStarCountsByUserIds = cache(
  async (userIds: string[]): Promise<Map<string, number>> => {
    if (userIds.length === 0) return new Map();
    const rows = await db
      .select({ id: profileStar.profileUserId, n: count() })
      .from(profileStar)
      .where(inArray(profileStar.profileUserId, userIds))
      .groupBy(profileStar.profileUserId);
    return new Map(rows.map(r => [r.id, r.n]));
  }
);

export const getTopStarredLast30Days = cache(async (limit: number) => {
  const since = new Date(Date.now() - THIRTY_DAYS_MS);
  const ranked = await db
    .select({ userId: profileStar.profileUserId, n: count() })
    .from(profileStar)
    .where(gt(profileStar.createdAt, since))
    .groupBy(profileStar.profileUserId)
    .orderBy(desc(count()))
    .limit(limit);

  if (ranked.length === 0) return [];

  const ids = ranked.map(r => r.userId);
  const users = await db.query.user.findMany({
    where: and(isNotNull(user.username), inArray(user.id, ids)),
    with: {
      profile: true,
      experiences: { orderBy: (e, { desc }) => [desc(e.startDate)], limit: 1 }
    }
  });

  const byId = new Map(users.map(u => [u.id, u]));
  return ranked.flatMap(r => {
    const u = byId.get(r.userId);
    if (!u?.username) return [];
    return [{ user: { ...u, username: u.username }, stars: r.n }];
  });
});
