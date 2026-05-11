import 'server-only';

import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { aiUsage } from '@/db/schema/ai-usage';

export const AI_DAILY_LIMIT = 20;

export class AiRateLimitError extends Error {
  constructor() {
    super(`Daily AI limit reached (${AI_DAILY_LIMIT} requests). Try again tomorrow.`);
    this.name = 'AiRateLimitError';
  }
}

const todayUtc = (): string => new Date().toISOString().slice(0, 10);

// Read-then-write; concurrent requests from the same user can race past the
// limit by at most one, which is fine for a soft daily cap on a school project.
export async function assertAndConsumeAiQuota(userId: string): Promise<void> {
  const dayKey = todayUtc();

  const existing = await db
    .select({ count: aiUsage.count })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.dayKey, dayKey)))
    .limit(1);

  const current = existing[0]?.count ?? 0;
  if (current >= AI_DAILY_LIMIT) throw new AiRateLimitError();

  await db
    .insert(aiUsage)
    .values({ userId, dayKey, count: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.userId, aiUsage.dayKey],
      set: { count: sql`${aiUsage.count} + 1` }
    });
}
