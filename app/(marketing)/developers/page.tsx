import { isNotNull } from 'drizzle-orm';
import Link from 'next/link';

import { DevelopersBrowser } from '@/components/developers-browser';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { user } from '@/db/schema';
import { getAvatarUrl, getRealName } from '@/lib/queries/public-profile';
import { getStarCountsByUserIds } from '@/lib/queries/stars';

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

export default async function DevelopersPage() {
  // FIXME-developers-pagination: hard cap until server-side filter/sort/paginate is built.
  const users = await db.query.user.findMany({
    where: isNotNull(user.username),
    limit: 100,
    with: {
      profile: true,
      experiences: true,
      projects: true
    }
  });

  const starCounts = await getStarCountsByUserIds(users.map(u => u.id));

  const enrichedUsers = users.map(u => {
    let yearsOfExperience = 0;
    if (u.experiences.length > 0) {
      const earliestExp = u.experiences.reduce((min, exp) =>
        exp.startDate < min.startDate ? exp : min
      );
      yearsOfExperience = Math.floor(
        (new Date().getTime() - earliestExp.startDate.getTime()) / MS_PER_YEAR
      );
    }

    return {
      id: u.id,
      username: u.username!,
      displayName: getRealName(u) ?? u.username!,
      headline: u.profile?.headline ?? '',
      bio: u.profile?.bio ?? '',
      location: u.profile?.location ?? '',
      avatarUrl: getAvatarUrl(u),
      availableForWork: u.profile?.availableForWork ?? false,
      yearsOfExperience,
      projectCount: u.projects.length,
      experienceCount: u.experiences.length,
      stars: starCounts.get(u.id) ?? 0
    };
  });

  return (
    <div className="bg-background min-h-full px-6 pb-10 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <h1 className="m-0 text-[length:var(--t-3xl)] font-medium tracking-[-0.022em]">
            Find Developers
          </h1>
          <p className="mt-2 text-[length:var(--t-lg)] text-[var(--ink-2)]">
            Search and filter through our community of talented developers
          </p>
        </div>

        <DevelopersBrowser initialUsers={enrichedUsers} />

        <div className="mt-16 flex flex-col items-center gap-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--paper-2)] px-8 py-12 text-center">
          <h2 className="m-0 text-[length:var(--t-2xl)] font-medium">Want to join?</h2>
          <p className="m-0 max-w-[560px] text-[length:var(--t-base)] text-[var(--ink-2)]">
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
