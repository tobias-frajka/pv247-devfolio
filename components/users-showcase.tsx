import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { getAvatarUrl, getRealName } from '@/lib/queries/public-profile';
import { getTopStarredLast30Days } from '@/lib/queries/stars';

const SHOWCASE_LIMIT = 6;

function ShowcaseHeading() {
  return (
    <h2 className="mb-8 text-center text-[length:var(--t-2xl)] font-medium tracking-[-0.01em]">
      Featured Developers
    </h2>
  );
}

export function UsersShowcaseSkeleton() {
  return (
    <section
      className="reveal-fade mt-16"
      aria-busy="true"
      aria-label="Loading featured developers"
    >
      <ShowcaseHeading />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SHOWCASE_LIMIT }).map((_, i) => (
          <Card
            key={i}
            className="h-full gap-4 rounded-[14px] border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-5"
          >
            <div className="flex items-start gap-4">
              <div className="skeleton-bone h-16 w-16 flex-shrink-0 rounded-full border border-[var(--hairline)]" />
              <div className="min-w-0 flex-1 space-y-2.5 pt-2">
                <div className="skeleton-bone h-3.5 w-2/3 rounded-[4px]" />
                <div className="skeleton-bone h-3 w-5/6 rounded-[4px]" />
                <div className="skeleton-bone h-2.5 w-2/5 rounded-[4px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export async function UsersShowcase() {
  const featured = await getTopStarredLast30Days(SHOWCASE_LIMIT);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <ShowcaseHeading />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map(({ user: u, stars }, i) => {
          const displayName = getRealName(u) ?? u.username;
          const avatarUrl = getAvatarUrl(u);
          const latestExperience = u.experiences[0];

          return (
            <Link
              key={u.id}
              href={`/${u.username}`}
              className="reveal-rise"
              style={{ animationDelay: `${i * 60}ms` }}
            >
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
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-[length:var(--t-base)] font-medium">
                        {displayName}
                      </h3>
                      <span className="inline-flex flex-shrink-0 items-center gap-1 text-[length:var(--t-xs)] text-[var(--ink-2)]">
                        <Star size={12} className="fill-current" />
                        {stars}
                      </span>
                    </div>
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
