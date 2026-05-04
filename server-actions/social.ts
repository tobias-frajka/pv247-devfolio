'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { social, type SocialPlatform } from '@/db/schema';
import { requireUsername } from '@/lib/dal';
import { socialSchema } from '@/schemas/social';

export async function upsertSocial(input: unknown) {
  const session = await requireUsername();
  const data = socialSchema.parse(input);

  const [row] = await db
    .insert(social)
    .values({ ...data, userId: session.user.id })
    .onConflictDoUpdate({
      target: [social.userId, social.platform],
      set: { url: data.url }
    })
    .returning();

  revalidatePath('/dashboard/socials');
  revalidatePath(`/${session.user.username}`);
  return row;
}

export async function removeSocial(platform: SocialPlatform) {
  const session = await requireUsername();

  await db
    .delete(social)
    .where(and(eq(social.userId, session.user.id), eq(social.platform, platform)));

  revalidatePath('/dashboard/socials');
  revalidatePath(`/${session.user.username}`);
}
