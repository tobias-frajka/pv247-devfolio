import { isNotNull } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { db } from '@/db';
import { user } from '@/db/schema';
import { getAvatarUrl, getRealName } from '@/lib/queries/public-profile';

export async function UsersShowcase() {
  const featured = await db.query.user.findMany({
    limit: 6,
    where: isNotNull(user.username),
    with: {
      profile: true,
      experiences: { orderBy: (e, { desc }) => [desc(e.startDate)], limit: 1 }
    }
  });

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="mb-8 text-center text-[length:var(--t-2xl)] font-medium tracking-[-0.01em]">
        Featured Developers
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map(u => {
          const displayName = getRealName(u) ?? u.username!;
          const avatarUrl = getAvatarUrl(u);
          const latestExperience = u.experiences[0];

          return (
            <Link key={u.id} href={`/${u.username}`}>
              <Card className="h-full cursor-pointer gap-4 rounded-[14px] border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-5 transition-all hover:bg-[var(--paper-3)]">
                <div className="flex items-start gap-4">
                  {avatarUrl && (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={64}
                      height={64}
                      className="h-16 w-16 flex-shrink-0 rounded-full border border-[var(--hairline)] object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[length:var(--t-base)] font-medium">
                      {displayName}
                    </h3>
                    {u.profile?.headline && (
                      <p className="m-0 truncate text-[length:var(--t-sm)] text-ellipsis text-[var(--ink-2)]">
                        {u.profile.headline}
                      </p>
                    )}
                    {latestExperience && (
                      <p className="m-0 mt-1 truncate text-[length:var(--t-xs)] text-ellipsis text-[var(--ink-3)]">
                        @ {latestExperience.company}
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
