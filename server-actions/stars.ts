'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { profileStar } from '@/db/schema/star';
import { getStarCount } from '@/lib/queries/stars';
import { getStarIdentity } from '@/lib/stars/identity';
import { usernameSchema } from '@/schemas/username';

const toggleStarSchema = z.object({ username: usernameSchema });

export type ToggleStarResult = { starred: boolean; count: number };

export async function toggleStar(input: unknown): Promise<ToggleStarResult> {
  const { username } = toggleStarSchema.parse(input);

  const [target, identity] = await Promise.all([
    db.query.user.findFirst({
      where: eq(user.username, username),
      columns: { id: true }
    }),
    getStarIdentity({ mint: true })
  ]);
  if (!target) throw new Error('Profile not found');

  if (identity.kind === 'user' && identity.userId === target.id) {
    throw new Error('Cannot star your own profile');
  }

  const { starred } = await db.transaction(async tx => {
    const existing = await tx.query.profileStar.findFirst({
      where: and(
        eq(profileStar.profileUserId, target.id),
        eq(profileStar.identityKey, identity.key)
      ),
      columns: { id: true }
    });
    if (existing) {
      await tx.delete(profileStar).where(eq(profileStar.id, existing.id));
      return { starred: false };
    }
    await tx
      .insert(profileStar)
      .values({
        profileUserId: target.id,
        identityKey: identity.key,
        identityKind: identity.kind
      })
      .onConflictDoNothing();
    return { starred: true };
  });

  const count = await getStarCount(target.id);

  revalidatePath(`/${username}`);
  revalidatePath('/developers');
  revalidatePath('/');

  return { starred, count };
}
