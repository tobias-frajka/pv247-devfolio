import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { experience, profile, project, skill, social } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { SocialsForm } from './socials-form';

export default async function SocialsPage() {
  const session = await requireUsername();
  const userId = session.user.id;

  const [socials, currentProfile, projects, experiences, skills] = await Promise.all([
    db.query.social.findMany({ where: eq(social.userId, userId) }),
    db.query.profile.findFirst({ where: eq(profile.userId, userId) }),
    db.query.project.findMany({
      where: eq(project.userId, userId),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)]
    }),
    db.query.experience.findMany({
      where: eq(experience.userId, userId),
      orderBy: (e, { desc }) => [desc(e.startDate)]
    }),
    db.query.skill.findMany({ where: eq(skill.userId, userId) })
  ]);

  return (
    <SocialsForm
      initialSocials={socials.map(s => ({ platform: s.platform, url: s.url }))}
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
        skills: skills.map(s => ({ id: s.id, name: s.name, category: s.category }))
      }}
    />
  );
}
