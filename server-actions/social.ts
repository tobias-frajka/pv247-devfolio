'use server';

import { and, eq, inArray } from 'drizzle-orm';
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

export async function upsertManySocials(data: Record<SocialPlatform, string>) {
  const session = await requireUsername();
  const userId = session.user.id;

  const toUpsert: { platform: SocialPlatform; url: string }[] = [];
  const toDelete: SocialPlatform[] = [];

  for (const [platform, url] of Object.entries(data) as [SocialPlatform, string][]) {
    if (url) {
      socialSchema.parse({ platform, url });
      toUpsert.push({ platform, url });
    } else {
      toDelete.push(platform);
    }
  }

  await db.transaction(async tx => {
    for (const item of toUpsert) {
      await tx
        .insert(social)
        .values({ ...item, userId })
        .onConflictDoUpdate({
          target: [social.userId, social.platform],
          set: { url: item.url }
        });
    }
    if (toDelete.length > 0) {
      await tx
        .delete(social)
        .where(and(eq(social.userId, userId), inArray(social.platform, toDelete)));
    }
  });

  revalidatePath('/dashboard/socials');
  revalidatePath(`/${session.user.username}`);
}
