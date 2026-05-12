import 'server-only';

import { sql } from 'drizzle-orm';

import { db } from '@/db';
import { aiUsage } from '@/db/schema/ai-usage';

export const AI_DAILY_LIMIT = 20;

export class AiRateLimitError extends Error {
  constructor() {
    super(`Daily AI limit reached (${AI_DAILY_LIMIT} requests). Try again tomorrow.`);
    this.name = 'AiRateLimitError';
  }
}

export const todayUtc = (): string => new Date().toISOString().slice(0, 10);

export async function assertAndConsumeAiQuota(userId: string): Promise<void> {
  const dayKey = todayUtc();
  const result = await db
    .insert(aiUsage)
    .values({ userId, dayKey, count: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.userId, aiUsage.dayKey],
      set: { count: sql`${aiUsage.count} + 1` },
      setWhere: sql`${aiUsage.count} < ${AI_DAILY_LIMIT}`
    })
    .returning({ count: aiUsage.count });
  if (result.length === 0) throw new AiRateLimitError();
}
