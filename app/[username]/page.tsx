import { eq } from 'drizzle-orm';
import { ExternalLink, Mail, Link as LinkIcon, Briefcase, Globe, AtSign } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { db } from '@/db';
import { profile, project, skill, experience, social, user } from '@/db/schema';
import { Button } from '@/components/ui/button';

type SocialIconProps = { platform: string };

function SocialIcon({ platform }: SocialIconProps) {
  switch (platform) {
    case 'github':
      return <LinkIcon size={16} />;
    case 'x':
      return <AtSign size={16} />;
    case 'linkedin':
      return <Briefcase size={16} />;
    case 'email':
      return <Mail size={16} />;
    case 'website':
      return <Globe size={16} />;
    default:
      return <ExternalLink size={16} />;
  }
}

function formatDate(start: Date, end: Date | null) {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(start)} — ${end ? fmt(end) : 'Present'}`;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const userData = await db.query.user.findFirst({
    where: eq(user.username, username)
  });

  if (!userData) {
    return {
      title: 'Portfolio not found'
    };
  }

  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, userData.id)
  });

  const displayName = userProfile?.displayName || userData.name || username;
  const bio = userProfile?.bio || '';
  const headline = userProfile?.headline || '';

  const description =
    bio.length > 160
      ? bio.substring(0, 160) + '…'
      : bio || headline || `Portfolio for ${displayName}`;

  return {
    title: `${displayName} — Developer Portfolio`,
    description,
    openGraph: {
      title: `${displayName} — Developer Portfolio`,
      description,
      images: [
        {
          url: `/api/og/${username}`,
          width: 1200,
          height: 630,
          alt: `${displayName}'s portfolio`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} — Developer Portfolio`,
      description,
      images: [`/api/og/${username}`]
    }
  };
}

export default async function PublicProfilePage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Fetch user by username
  const userData = await db.query.user.findFirst({
    where: eq(user.username, username)
  });

  if (!userData) {
    notFound();
  }

  // Fetch all user data in parallel
  const [userProfile, projects, skills, experiences, socials] = await Promise.all([
    db.query.profile.findFirst({
      where: eq(profile.userId, userData.id)
    }),
    db.query.project.findMany({
      where: eq(project.userId, userData.id),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)]
    }),
    db.query.skill.findMany({
      where: eq(skill.userId, userData.id),
      orderBy: (s, { asc }) => [asc(s.category)]
    }),
    db.query.experience.findMany({
      where: eq(experience.userId, userData.id),
      orderBy: (e, { desc }) => [desc(e.startDate)]
    }),
    db.query.social.findMany({
      where: eq(social.userId, userData.id)
    })
  ]);

  const displayName = userProfile?.displayName || userData.name || username;
  const headline = userProfile?.headline || '';
  const bio = userProfile?.bio || '';
  const location = userProfile?.location || '';
  const avatarUrl = userProfile?.avatarUrl || userData.image;
  const availableForWork = userProfile?.availableForWork ?? false;

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s.name);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const categories = Object.keys(skillsByCategory).sort();

  return (
    <div className="bg-background min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-[880px] flex-col gap-12">
        {/* Hero Section */}
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

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2
              className="m-0 font-medium"
              style={{ fontSize: 'var(--t-2xl)', letterSpacing: '-0.012em' }}
            >
              Projects
            </h2>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {projects.map(p => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {p.githubUrl || p.liveUrl ? (
                        <a
                          href={p.liveUrl || p.githubUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="m-0 font-medium hover:underline"
                          style={{ fontSize: 'var(--t-base)', color: 'var(--brand)' }}
                        >
                          {p.title}
                        </a>
                      ) : (
                        <p className="m-0 font-medium" style={{ fontSize: 'var(--t-base)' }}>
                          {p.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {p.description && (
                    <p
                      className="m-0 line-clamp-2"
                      style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
                    >
                      {p.description}
                    </p>
                  )}

                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.techStack.map(tech => (
                        <span
                          key={tech}
                          className="rounded bg-[var(--paper-3)] px-2 py-0.5 text-xs"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline"
                        style={{ color: 'var(--ink-3)' }}
                      >
                        <LinkIcon size={12} /> GitHub
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline"
                        style={{ color: 'var(--ink-3)' }}
                      >
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* No Projects Message */}
        {projects.length === 0 && (
          <section className="flex flex-col gap-4">
            <h2
              className="m-0 font-medium"
              style={{ fontSize: 'var(--t-2xl)', letterSpacing: '-0.012em' }}
            >
              Projects
            </h2>
            <div
              className="rounded-lg border border-dashed border-[var(--hairline)] p-10 text-center"
              style={{ color: 'var(--ink-3)' }}
            >
              <p className="m-0 text-sm">No projects yet.</p>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2
              className="m-0 font-medium"
              style={{ fontSize: 'var(--t-2xl)', letterSpacing: '-0.012em' }}
            >
              Experience
            </h2>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {experiences.map(e => (
                <li
                  key={e.id}
                  className="flex flex-col gap-2 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper-2)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="m-0 font-medium" style={{ fontSize: 'var(--t-base)' }}>
                        {e.role}
                      </p>
                      <p
                        className="m-0 mt-0.5"
                        style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
                      >
                        {e.company}
                      </p>
                    </div>

                    <p
                      className="m-0 text-right whitespace-nowrap"
                      style={{
                        fontSize: 'var(--t-xs)',
                        color: 'var(--ink-3)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {formatDate(e.startDate, e.endDate)}
                    </p>
                  </div>

                  {e.description && (
                    <p
                      className="m-0 mt-1 line-clamp-2"
                      style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-2)' }}
                    >
                      {e.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills Section */}
        {categories.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2
              className="m-0 font-medium"
              style={{ fontSize: 'var(--t-2xl)', letterSpacing: '-0.012em' }}
            >
              Skills
            </h2>

            <div className="flex flex-col gap-6">
              {categories.map(category => (
                <div key={category} className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
                  <div
                    className="m-0"
                    style={{
                      fontSize: 'var(--t-xs)',
                      fontWeight: 600,
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {category}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skillsByCategory[category].map(skillName => (
                      <span
                        key={skillName}
                        className="rounded border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1 text-xs"
                      >
                        {skillName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Socials Section */}
        {socials.length > 0 && (
          <section className="flex flex-col items-center gap-6 border-t border-[var(--hairline-soft)] pt-8">
            <div className="flex flex-wrap justify-center gap-2">
              {socials.map(s => (
                <Button
                  key={`${s.platform}`}
                  variant="secondary"
                  size="sm"
                  asChild
                  className="text-[var(--ink-2)]"
                >
                  <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.platform}>
                    <SocialIcon platform={s.platform} />
                    <span className="ml-1.5 capitalize">
                      {s.platform === 'x' ? 'X' : s.platform}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
