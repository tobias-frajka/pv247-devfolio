'use server';

import { sql, isNotNull, and } from 'drizzle-orm';

import { db } from '@/db';
import { profile, user } from '@/db/schema';

export async function getRandomUser(): Promise<string | null> {
  const result = await db
    .select({ username: user.username })
    .from(user)
    .innerJoin(profile, and(sql`${user.id} = ${profile.userId}`, isNotNull(profile.headline)))
    .where(isNotNull(user.username))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  return result[0]?.username ?? null;
}
