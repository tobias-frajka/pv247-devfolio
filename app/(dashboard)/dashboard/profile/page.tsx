import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { experience, profile, project, skill, social } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await requireUsername();
  const userId = session.user.id;

  const [currentProfile, projects, experiences, skills, socials] = await Promise.all([
    db.query.profile.findFirst({ where: eq(profile.userId, userId) }),
    db.query.project.findMany({
      where: eq(project.userId, userId),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)]
    }),
    db.query.experience.findMany({
      where: eq(experience.userId, userId),
      orderBy: (e, { desc }) => [desc(e.startDate)]
    }),
    db.query.skill.findMany({ where: eq(skill.userId, userId) }),
    db.query.social.findMany({ where: eq(social.userId, userId) })
  ]);

  return (
    <div className="flex flex-col gap-8">
      <ProfileForm
        initialProfile={currentProfile ?? null}
        username={session.user.username}
        fallbackName={session.user.name}
        fallbackAvatar={session.user.image ?? null}
        skills={skills.map(s => ({ name: s.name, category: s.category }))}
        otherSections={{
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
          skills: skills.map(s => ({ id: s.id, name: s.name, category: s.category })),
          socials: socials.map(s => ({ platform: s.platform, url: s.url }))
        }}
      />
    </div>
  );
}
