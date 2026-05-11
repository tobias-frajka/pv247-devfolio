import { MapPin } from 'lucide-react';
import Image from 'next/image';

import type { StarContext } from '@/lib/queries/stars';
import type { ProfileData } from '@/types/profile-data';

import { StarButton } from './star-button';

type Props = Pick<
  ProfileData,
  'displayName' | 'headline' | 'bio' | 'location' | 'avatarUrl' | 'availableForWork'
> & {
  username: string;
  stars?: StarContext;
};

export function HeroSection({
  displayName,
  headline,
  bio,
  location,
  avatarUrl,
  availableForWork,
  username,
  stars
}: Props) {
  return (
    <section className="flex flex-col items-center gap-6 text-center">
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={displayName}
          width={112}
          height={112}
          priority
          className="h-28 w-28 rounded-full border border-[var(--hairline)] object-cover"
        />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[length:var(--t-3xl)] font-medium tracking-[-0.022em]">
          {displayName}
        </h1>

        {headline && (
          <p className="m-0 text-[length:var(--t-lg)] text-[var(--ink-2)]">{headline}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        {bio && (
          <p className="m-0 max-w-[560px] text-[length:var(--t-base)] text-[var(--ink-2)]">{bio}</p>
        )}

        {location && (
          <div className="flex items-center justify-center gap-2 text-[length:var(--t-sm)] text-[var(--ink-3)]">
            <MapPin size={16} />
            <p className="m-0">{location}</p>
          </div>
        )}
      </div>

      {availableForWork && (
        <div className="flex items-center gap-2 rounded-full border border-[var(--brand)] bg-[var(--brand-ghost)] px-3 py-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--brand)]" />
          <span className="m-0 text-[length:var(--t-sm)] text-[var(--brand)]">
            Available for work
          </span>
        </div>
      )}

      {stars && (
        <StarButton
          username={username}
          initialCount={stars.count}
          initialStarred={stars.viewerHasStarred}
          canStar={stars.canStar}
        />
      )}
    </section>
  );
}
