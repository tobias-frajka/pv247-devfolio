'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { profile } from '@/db/schema';
import { requireUsername } from '@/lib/dal';
import { profileSchema } from '@/schemas/profile';

export async function upsertProfile(input: unknown) {
  const session = await requireUsername();
  const data = profileSchema.parse(input);

  const [row] = await db
    .insert(profile)
    .values({ ...data, userId: session.user.id })
    .onConflictDoUpdate({ target: profile.userId, set: data })
    .returning();

  revalidatePath('/dashboard/profile');
  revalidatePath(`/${session.user.username}`);
  return row;
}
