import Link from 'next/link';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { PublicProfile } from '@/components/public-profile/public-profile';
import { db } from '@/db';
import { experience, profile, project, skill, social, user } from '@/db/schema';
import type { ProfileData } from '@/types/profile-data';

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

  const userData = await db.query.user.findFirst({
    where: eq(user.username, username)
  });

  if (!userData) {
    notFound();
  }

  const [userProfile, projects, experiences, skills, socials] = await Promise.all([
    db.query.profile.findFirst({
      where: eq(profile.userId, userData.id)
    }),
    db.query.project.findMany({
      where: eq(project.userId, userData.id),
      orderBy: (p, { asc }) => [asc(p.sortOrder), asc(p.createdAt)]
    }),
    db.query.experience.findMany({
      where: eq(experience.userId, userData.id),
      orderBy: (e, { desc }) => [desc(e.startDate)]
    }),
    db.query.skill.findMany({
      where: eq(skill.userId, userData.id),
      orderBy: (s, { asc }) => [asc(s.category)]
    }),
    db.query.social.findMany({
      where: eq(social.userId, userData.id)
    })
  ]);

  const data: ProfileData = {
    username,
    displayName: userProfile?.displayName || userData.name || username,
    headline: userProfile?.headline ?? '',
    bio: userProfile?.bio ?? '',
    location: userProfile?.location ?? '',
    avatarUrl: userProfile?.avatarUrl || userData.image || null,
    availableForWork: userProfile?.availableForWork ?? false,
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      techStack: p.techStack ?? [],
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null
    })),
    experiences: experiences.map(e => ({
      id: e.id,
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description
    })),
    skills: skills.map(s => ({ id: s.id, name: s.name, category: s.category })),
    socials: socials.map(s => ({ platform: s.platform, url: s.url }))
  };

  return (
    <>
      <div className="bg-background px-6 py-10 md:px-10">
        <div className="mx-auto max-w-[880px]">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/">← Back to home</Link>
          </Button>
        </div>
      </div>
      <PublicProfile data={data} />
    </>
  );
}
