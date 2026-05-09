import { eq } from 'drizzle-orm';
import { ExternalLink, Github, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { db } from '@/db';
import { profile, project, skill, experience, social, user } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type SocialIconProps = { platform: string };

function SocialIcon({ platform }: SocialIconProps) {
  switch (platform) {
    case 'github':
      return <Github size={18} />;
    case 'x':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.902 6.75h-3.31l7.73-8.835L.456 2.25h6.75l4.75 6.236L17.56 2.25h.684zm-1.106 17.92h1.828L5.283 4.126H3.283l14.855 16.044z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.5v8.5h2.5v-4.34c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.34h2.5M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m1.25 12h-2.5v-8.5h2.5v8.5z" />
        </svg>
      );
    case 'email':
      return <Mail size={18} />;
    case 'website':
      return <ExternalLink size={18} />;
    default:
      return <ExternalLink size={18} />;
  }
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
            <Image
              src={avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border border-[var(--hairline)] object-cover"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {projects.map(p => (
                <Card key={p.id} className="flex flex-col gap-3 p-5">
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 font-medium" style={{ fontSize: 'var(--t-base)' }}>
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="m-0" style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}>
                        {p.description}
                      </p>
                    )}
                  </div>

                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.techStack.map(tech => (
                        <span
                          key={tech}
                          className="rounded border border-[var(--hairline)] bg-[var(--paper-3)] px-2.5 py-1 text-xs"
                          style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-3)' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {p.githubUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github size={16} />
                          Code
                        </a>
                      </Button>
                    )}
                    {p.liveUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} />
                          Live
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
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

            <div className="flex flex-col gap-3">
              {experiences.map(e => (
                <Card key={e.id} className="flex flex-col gap-2 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="m-0 font-medium" style={{ fontSize: 'var(--t-base)' }}>
                        {e.role}
                      </h3>
                      <p
                        className="m-0 mt-1"
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
                      {e.startDate.getFullYear()}
                      {e.endDate && ` – ${e.endDate.getFullYear()}`}
                      {!e.endDate && ' – Present'}
                    </p>
                  </div>

                  {e.description && (
                    <p
                      className="m-0 mt-2"
                      style={{ fontSize: 'var(--t-sm)', color: 'var(--ink-2)' }}
                    >
                      {e.description}
                    </p>
                  )}
                </Card>
              ))}
            </div>
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
          <section className="mt-4 flex flex-col items-center gap-4 border-t border-[var(--hairline-soft)] pt-8">
            <div className="flex gap-3">
              {socials.map(s => (
                <Button
                  key={`${s.platform}`}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-[var(--ink-2)] hover:text-[var(--ink)]"
                >
                  <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.platform}>
                    <SocialIcon platform={s.platform} />
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
