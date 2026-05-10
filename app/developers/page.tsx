import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { user, profile, experience, project } from '@/db/schema';
import { DevelopersBrowser } from '@/components/developers-browser';

export default async function DevelopersPage() {
  // Fetch all users with their profiles
  const users = await db.query.user.findMany({
    with: {
      profile: true,
      experiences: true,
      projects: true
    }
  });

  // Enrich users with experience years calculation
  const enrichedUsers = users.map(u => {
    const userProfile = u.profile;
    const displayName = userProfile?.displayName || u.name || u.username;
    const avatarUrl = userProfile?.avatarUrl || u.image;

    // Calculate years of experience (from earliest start date to now)
    let yearsOfExperience = 0;
    if (u.experiences && u.experiences.length > 0) {
      const earliestExp = u.experiences.reduce((min, exp) =>
        exp.startDate < min.startDate ? exp : min
      );
      const now = new Date();
      yearsOfExperience = Math.floor(
        (now.getTime() - earliestExp.startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );
    }

    return {
      id: u.id,
      username: u.username,
      displayName,
      headline: userProfile?.headline ?? '',
      bio: userProfile?.bio ?? '',
      location: userProfile?.location ?? '',
      avatarUrl,
      availableForWork: userProfile?.availableForWork ?? false,
      yearsOfExperience,
      projectCount: u.projects?.length ?? 0,
      experienceCount: u.experiences?.length ?? 0
    };
  });

  return (
    <div className="bg-background min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/">← Back to home</Link>
        </Button>

        <div className="mb-12">
          <h1 className="m-0 font-medium tracking-[-0.022em]" style={{ fontSize: 'var(--t-3xl)' }}>
            Find Developers
          </h1>
          <p className="mt-2" style={{ fontSize: 'var(--t-lg)', color: 'var(--ink-2)' }}>
            Search and filter through our community of talented developers
          </p>
        </div>

        <DevelopersBrowser initialUsers={enrichedUsers} />

        <div className="mt-16 flex flex-col items-center gap-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--paper-2)] px-8 py-12 text-center">
          <h2 className="m-0 font-medium" style={{ fontSize: 'var(--t-2xl)' }}>
            Want to join?
          </h2>
          <p
            className="m-0 max-w-[560px]"
            style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}
          >
            Build your developer portfolio and showcase your skills to the community.
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Enlist today →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
