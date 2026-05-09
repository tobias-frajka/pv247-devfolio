import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { social } from '@/db/schema';
import { requireUsername } from '@/lib/dal';

import { SocialsForm } from './socials-form';

export default async function SocialsPage() {
  const session = await requireUsername();

  const socials = await db.query.social.findMany({
    where: eq(social.userId, session.user.id)
  });

  return <SocialsForm initialSocials={socials.map(s => ({ platform: s.platform, url: s.url }))} />;
}
