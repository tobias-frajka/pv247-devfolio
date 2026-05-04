import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { experience, profile, project, skill, social } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { TestControls } from './test-controls';

export default async function ProfilePage() {
  const session = await requireUsername();
  const userId = session.user.id;

  const [currentProfile, projects, skills, socials, experiences] = await Promise.all([
    db.query.profile.findFirst({ where: eq(profile.userId, userId) }),
    db.query.project.findMany({ where: eq(project.userId, userId) }),
    db.query.skill.findMany({ where: eq(skill.userId, userId) }),
    db.query.social.findMany({ where: eq(social.userId, userId) }),
    db.query.experience.findMany({ where: eq(experience.userId, userId) })
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Profile (smoke test)
        </h1>
        <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
          Throwaway controls so the backend can be exercised before the dashboard
          track wires real forms. Replace this page with the actual editor when ready.
        </p>
      </div>

      <section className="rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4">
        <div className="eyebrow mb-2">current state</div>
        <ul
          className="m-0 list-none space-y-1 p-0 font-mono"
          style={{ fontSize: 'var(--t-sm)' }}
        >
          <li>username: {session.user.username}</li>
          <li>profile.displayName: {currentProfile?.displayName ?? '—'}</li>
          <li>profile.headline: {currentProfile?.headline ?? '—'}</li>
          <li>profile.bio: {currentProfile?.bio ? `${currentProfile.bio.slice(0, 80)}…` : '—'}</li>
          <li>profile.availableForWork: {String(currentProfile?.availableForWork ?? false)}</li>
          <li>projects: {projects.length}</li>
          <li>skills: {skills.length}</li>
          <li>experience: {experiences.length}</li>
          <li>socials: {socials.length}</li>
        </ul>
      </section>

      <TestControls
        profile={currentProfile ?? null}
        projects={projects.map(p => ({ id: p.id, title: p.title }))}
        skills={skills.map(s => ({ id: s.id, name: s.name, category: s.category }))}
        socials={socials.map(s => ({ id: s.id, platform: s.platform, url: s.url }))}
      />
    </div>
  );
}
