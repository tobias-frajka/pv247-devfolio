'use server';

import { sql, isNotNull } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema';

export async function getRandomUser(): Promise<string | null> {
  const result = await db
    .select({ username: user.username })
    .from(user)
    .where(isNotNull(user.username))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  return result[0]?.username ?? null;
}
