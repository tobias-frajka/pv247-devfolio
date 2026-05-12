import 'server-only';

import { eq } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/db';
import { user } from '@/db/schema/auth';

export const getDashboardData = cache(async (userId: string) =>
  db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { id: true },
    with: {
      profile: true,
      projects: { orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)] },
      experiences: { orderBy: (e, { desc }) => [desc(e.startDate)] },
      skills: true,
      socials: true
    }
  })
);

export type DashboardData = NonNullable<Awaited<ReturnType<typeof getDashboardData>>>;

export const toProfileSeed = (row: DashboardData['profile'] | null) =>
  row
    ? {
        displayName: row.displayName,
        headline: row.headline,
        bio: row.bio,
        location: row.location,
        avatarUrl: row.avatarUrl,
        availableForWork: row.availableForWork
      }
    : null;

export const toProjectSummaries = (rows: DashboardData['projects']) =>
  rows.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    techStack: p.techStack ?? [],
    githubUrl: p.githubUrl ?? null,
    liveUrl: p.liveUrl ?? null
  }));

export const toExperienceSummaries = (rows: DashboardData['experiences']) =>
  rows.map(e => ({
    id: e.id,
    company: e.company,
    role: e.role,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description
  }));

export const toSkillSummaries = (rows: DashboardData['skills']) =>
  rows.map(s => ({ id: s.id, name: s.name, category: s.category }));

export const toSocialSummaries = (rows: DashboardData['socials']) =>
  rows.map(s => ({ platform: s.platform, url: s.url }));
