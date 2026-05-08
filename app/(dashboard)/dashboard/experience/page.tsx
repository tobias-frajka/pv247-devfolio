import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { experience } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { ExperienceClient } from './experience-client';

export default async function ExperiencePage() {
  const session = await requireUsername();

  const experiences = await db.query.experience.findMany({
    where: eq(experience.userId, session.user.id),
    orderBy: (e, { desc }) => [desc(e.startDate)]
  });

  return (
    <ExperienceClient
      experiences={experiences.map(e => ({
        id: e.id,
        company: e.company,
        role: e.role,
        startDate: e.startDate,
        endDate: e.endDate ?? null,
        description: e.description ?? null
      }))}
    />
  );
}
