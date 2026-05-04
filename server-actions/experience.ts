'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { experience } from '@/db/schema';
import { requireOwnership, requireUsername } from '@/lib/dal';
import { experienceSchema } from '@/schemas/experience';

export async function createExperience(input: unknown) {
  const session = await requireUsername();
  const data = experienceSchema.parse(input);

  const [row] = await db
    .insert(experience)
    .values({ ...data, userId: session.user.id })
    .returning();

  revalidatePath('/dashboard/experience');
  revalidatePath(`/${session.user.username}`);
  return row;
}

export async function updateExperience(id: string, input: unknown) {
  const existing = await db.query.experience.findFirst({ where: eq(experience.id, id) });
  const { session } = await requireOwnership(existing, '/dashboard/experience');
  const data = experienceSchema.parse(input);

  const [row] = await db.update(experience).set(data).where(eq(experience.id, id)).returning();

  revalidatePath('/dashboard/experience');
  if (session.user.username) revalidatePath(`/${session.user.username}`);
  return row;
}

export async function deleteExperience(id: string) {
  const existing = await db.query.experience.findFirst({ where: eq(experience.id, id) });
  const { session } = await requireOwnership(existing, '/dashboard/experience');

  await db.delete(experience).where(eq(experience.id, id));

  revalidatePath('/dashboard/experience');
  if (session.user.username) revalidatePath(`/${session.user.username}`);
}
