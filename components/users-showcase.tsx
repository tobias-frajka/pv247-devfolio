import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { experience, profile, user } from '@/db/schema';
import { Card } from '@/components/ui/card';

export async function UsersShowcase() {
  // Fetch users with their profiles
  const users = await db.query.user.findMany({
    limit: 6,
    with: {
      profile: true
    }
  });

  if (users.length === 0) {
    return null;
  }

  // Fetch latest experience for each user
  const usersWithExperience = await Promise.all(
    users.map(async u => {
      const latestExp = await db.query.experience.findFirst({
        where: eq(experience.userId, u.id),
        orderBy: e => [desc(e.startDate)]
      });

      return {
        ...u,
        latestExperience: latestExp
      };
    })
  );

  return (
    <section className="mt-16">
      <h2
        className="mb-8 text-center font-medium tracking-[-0.01em]"
        style={{ fontSize: 'var(--t-2xl)' }}
      >
        Featured Developers
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usersWithExperience.map(u => {
          const userProfile = u.profile;
          const displayName = userProfile?.displayName || u.name || u.username;
          const avatarUrl = userProfile?.avatarUrl || u.image;

          return (
            <Link key={u.id} href={`/${u.username}`}>
              <Card className="h-full cursor-pointer gap-4 rounded-[14px] border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-5 transition-all hover:bg-[var(--paper-3)]">
                <div className="flex items-start gap-4">
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-16 w-16 flex-shrink-0 rounded-full border border-[var(--hairline)] object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium" style={{ fontSize: 'var(--t-base)' }}>
                      {displayName}
                    </h3>
                    {userProfile?.headline && (
                      <p
                        className="m-0 truncate text-ellipsis"
                        style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
                      >
                        {userProfile.headline}
                      </p>
                    )}
                    {u.latestExperience && (
                      <p
                        className="m-0 mt-1 truncate text-ellipsis"
                        style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-3)' }}
                      >
                        @ {u.latestExperience.company}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
