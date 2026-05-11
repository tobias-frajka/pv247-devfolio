import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { PublicProfile } from '@/components/public-profile/public-profile';
import {
  getPublicProfileByUsername,
  getRealName,
  toProfileData
} from '@/lib/queries/public-profile';
import { getStarCount, hasStarred } from '@/lib/queries/stars';
import { getStarIdentity } from '@/lib/stars/identity';
import { truncateAtWord } from '@/lib/utils';

export async function generateMetadata({
  params
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const userData = await getPublicProfileByUsername(username);

  if (!userData) {
    return { title: 'Portfolio not found' };
  }

  const realName = getRealName(userData);
  const title = realName ? `${realName} — Developer Portfolio` : `@${username} — DevFolio`;
  const altSubject = realName ?? `@${username}`;
  const bio = userData.profile?.bio || '';
  const headline = userData.profile?.headline || '';

  const description = bio ? truncateAtWord(bio, 160) : headline || `Portfolio for ${altSubject}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og/${username}`,
          width: 1200,
          height: 630,
          alt: `${altSubject}'s portfolio`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
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

  const userData = await getPublicProfileByUsername(username);

  if (!userData) {
    notFound();
  }

  const data = toProfileData(userData, username);

  const identity = await getStarIdentity({ mint: false });
  const [starCount, viewerHasStarred] = await Promise.all([
    getStarCount(userData.id),
    hasStarred(userData.id, identity.key)
  ]);
  const canStar = !(identity.kind === 'user' && identity.userId === userData.id);

  return (
    <>
      <div className="bg-background pt-10">
        <div className="mx-auto max-w-[880px] px-6 md:px-10">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">← Back to home</Link>
          </Button>
        </div>
      </div>
      <PublicProfile data={data} stars={{ count: starCount, viewerHasStarred, canStar }} />
    </>
  );
}
