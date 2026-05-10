import type { ProfileData } from '@/types/profile-data';

type Props = Pick<
  ProfileData,
  'displayName' | 'headline' | 'bio' | 'location' | 'avatarUrl' | 'availableForWork'
>;

export function HeroSection({
  displayName,
  headline,
  bio,
  location,
  avatarUrl,
  availableForWork
}: Props) {
  return (
    <section className="flex flex-col items-center gap-6 text-center">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={displayName}
          className="h-28 w-28 rounded-full border border-[var(--hairline)] object-cover"
        />
      )}

      <div className="flex flex-col gap-2">
        <h1
          className="m-0 font-medium"
          style={{ fontSize: 'var(--t-3xl)', letterSpacing: '-0.022em' }}
        >
          {displayName}
        </h1>

        {headline && (
          <p className="m-0" style={{ fontSize: 'var(--t-lg)', color: 'var(--ink-2)' }}>
            {headline}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        {bio && (
          <p
            className="m-0 max-w-[560px]"
            style={{ fontSize: 'var(--t-base)', color: 'var(--ink-2)' }}
          >
            {bio}
          </p>
        )}

        {location && (
          <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-3)' }}>
            📍 {location}
          </p>
        )}
      </div>

      {availableForWork && (
        <div className="flex items-center gap-2 rounded-full border border-[var(--brand)] bg-[var(--brand-ghost)] px-3 py-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--brand)' }}
          />
          <span className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--brand)' }}>
            Available for work
          </span>
        </div>
      )}
    </section>
  );
}
