import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { profile, skill } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await requireUsername();
  const userId = session.user.id;

  const [currentProfile, skills] = await Promise.all([
    db.query.profile.findFirst({ where: eq(profile.userId, userId) }),
    db.query.skill.findMany({ where: eq(skill.userId, userId) })
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1
          className="m-0"
          style={{ fontSize: 'var(--t-3xl)', fontWeight: 500, letterSpacing: '-0.022em' }}
        >
          Profile
        </h1>
        <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
          This shows on your public page at{' '}
          <span className="font-mono">/{session.user.username}</span>
        </p>
      </div>

      <ProfileForm
        initialProfile={currentProfile ?? null}
        skills={skills.map(s => ({ name: s.name, category: s.category }))}
      />
    </div>
  );
}
