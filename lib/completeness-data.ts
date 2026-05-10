import 'server-only';

import { count, eq } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/db';
import { experience, profile, project, skill, social } from '@/db/schema';

import type { CompletenessData } from './completeness';

export const getCompletenessData = cache(async (userId: string): Promise<CompletenessData> => {
  const [profileRow, projectCountRows, skillCountRows, experienceCountRows, socialCountRows] =
    await Promise.all([
      db.query.profile.findFirst({
        where: eq(profile.userId, userId),
        columns: { displayName: true, headline: true, bio: true, avatarUrl: true }
      }),
      db.select({ value: count() }).from(project).where(eq(project.userId, userId)),
      db.select({ value: count() }).from(skill).where(eq(skill.userId, userId)),
      db.select({ value: count() }).from(experience).where(eq(experience.userId, userId)),
      db.select({ value: count() }).from(social).where(eq(social.userId, userId))
    ]);

  return {
    profile: profileRow ?? null,
    projectCount: projectCountRows[0]?.value ?? 0,
    skillCount: skillCountRows[0]?.value ?? 0,
    experienceCount: experienceCountRows[0]?.value ?? 0,
    socialCount: socialCountRows[0]?.value ?? 0
  };
});
