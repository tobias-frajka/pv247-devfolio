import 'server-only';

import { eq } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/db';
import { user } from '@/db/schema/auth';
import type { ProfileData } from '@/types/profile-data';

export const getPublicProfileByUsername = cache(async (username: string) =>
  db.query.user.findFirst({
    where: eq(user.username, username),
    columns: { id: true, name: true, image: true },
    with: {
      profile: true,
      projects: { orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)] },
      skills: true,
      experiences: { orderBy: (e, { desc }) => [desc(e.startDate)] },
      socials: true
    }
  })
);

export type PublicProfileRow = NonNullable<Awaited<ReturnType<typeof getPublicProfileByUsername>>>;

export const getPublicProfileHeader = cache(async (username: string) =>
  db.query.user.findFirst({
    where: eq(user.username, username),
    columns: { name: true },
    with: {
      profile: { columns: { displayName: true, headline: true, bio: true } }
    }
  })
);

type DisplayNameRow =
  | {
      name?: string | null;
      profile?: { displayName?: string | null } | null;
    }
  | null
  | undefined;

type AvatarRow =
  | {
      image?: string | null;
      profile?: { avatarUrl?: string | null } | null;
    }
  | null
  | undefined;

export function getRealName(row: DisplayNameRow): string | null {
  return row?.profile?.displayName?.trim() || row?.name || null;
}

export function getAvatarUrl(row: AvatarRow): string | null {
  return row?.profile?.avatarUrl || row?.image || null;
}

export function toProfileData(row: PublicProfileRow, username: string): ProfileData {
  return {
    username,
    displayName: getRealName(row) ?? username,
    headline: row.profile?.headline ?? '',
    bio: row.profile?.bio ?? '',
    location: row.profile?.location ?? '',
    avatarUrl: getAvatarUrl(row),
    availableForWork: row.profile?.availableForWork ?? false,
    projects: row.projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      techStack: p.techStack ?? [],
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null
    })),
    experiences: row.experiences.map(e => ({
      id: e.id,
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description
    })),
    skills: row.skills.map(s => ({ id: s.id, name: s.name, category: s.category })),
    socials: row.socials.map(s => ({ platform: s.platform, url: s.url }))
  };
}
