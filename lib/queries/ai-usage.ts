import 'server-only';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { aiUsage } from '@/db/schema/ai-usage';
import { AI_DAILY_LIMIT } from '@/lib/ai-rate-limit';

const todayUtc = (): string => new Date().toISOString().slice(0, 10);

export async function getAiUsageToday(userId: string): Promise<{ used: number; limit: number }> {
  const row = await db
    .select({ count: aiUsage.count })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.dayKey, todayUtc())))
    .limit(1);

  return { used: row[0]?.count ?? 0, limit: AI_DAILY_LIMIT };
}
