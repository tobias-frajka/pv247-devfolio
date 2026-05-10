import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { experience, profile, project, skill, social } from '@/db/schema';
import type { SkillCategory } from '@/db/schema/skill';
import { requireUsername } from '@/lib/dal';

import { SkillsClient } from './skills-client';

export default async function SkillsPage() {
  const session = await requireUsername();
  const userId = session.user.id;

  const [skills, projects, currentProfile, experiences, socials] = await Promise.all([
    db.query.skill.findMany({ where: eq(skill.userId, userId) }),
    db.query.project.findMany({
      where: eq(project.userId, userId),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)]
    }),
    db.query.profile.findFirst({ where: eq(profile.userId, userId) }),
    db.query.experience.findMany({
      where: eq(experience.userId, userId),
      orderBy: (e, { desc }) => [desc(e.startDate)]
    }),
    db.query.social.findMany({ where: eq(social.userId, userId) })
  ]);

  const skillNames = new Set(skills.map(s => s.name.toLowerCase()));

  const allTechTags = projects.flatMap(p => p.techStack ?? []);
  const seenLower = new Map<string, string>();
  for (const tag of allTechTags) {
    const lower = tag.toLowerCase();
    if (!seenLower.has(lower)) seenLower.set(lower, tag);
  }
  const suggestions = [...seenLower.values()]
    .filter(tag => !skillNames.has(tag.toLowerCase()))
    .map(name => ({ name, category: 'Tools' as SkillCategory }));

  return (
    <SkillsClient
      skills={skills.map(s => ({ id: s.id, name: s.name, category: s.category }))}
      suggestions={suggestions}
      username={session.user.username}
      fallbackName={session.user.name}
      fallbackAvatar={session.user.image ?? null}
      previewSeed={{
        profile: currentProfile
          ? {
              displayName: currentProfile.displayName,
              headline: currentProfile.headline,
              bio: currentProfile.bio,
              location: currentProfile.location,
              avatarUrl: currentProfile.avatarUrl,
              availableForWork: currentProfile.availableForWork
            }
          : null,
        projects: projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          techStack: p.techStack ?? [],
          githubUrl: p.githubUrl ?? null,
          liveUrl: p.liveUrl ?? null
        })),
        experiences: experiences.map(e => ({
          id: e.id,
          company: e.company,
          role: e.role,
          startDate: e.startDate,
          endDate: e.endDate,
          description: e.description
        })),
        socials: socials.map(s => ({ platform: s.platform, url: s.url }))
      }}
    />
  );
}
