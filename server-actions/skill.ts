'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { skill, type SkillCategory } from '@/db/schema';
import { requireOwnership, requireUsername } from '@/lib/dal';
import { skillSchema } from '@/schemas/skill';

export async function addSkill(input: unknown) {
  const session = await requireUsername();
  const data = skillSchema.parse(input);

  const [row] = await db
    .insert(skill)
    .values({ ...data, userId: session.user.id })
    .onConflictDoNothing()
    .returning();

  revalidatePath('/dashboard/skills');
  revalidatePath(`/${session.user.username}`);
  return row;
}

export async function updateSkillCategory(id: string, category: SkillCategory) {
  const existing = await db.query.skill.findFirst({ where: eq(skill.id, id) });
  const { session } = await requireOwnership(existing, '/dashboard/skills');

  await db.update(skill).set({ category }).where(eq(skill.id, id));

  revalidatePath('/dashboard/skills');
  if (session.user.username) revalidatePath(`/${session.user.username}`);
}

export async function removeSkill(id: string) {
  const existing = await db.query.skill.findFirst({ where: eq(skill.id, id) });
  const { session } = await requireOwnership(existing, '/dashboard/skills');

  await db.delete(skill).where(eq(skill.id, id));

  revalidatePath('/dashboard/skills');
  if (session.user.username) revalidatePath(`/${session.user.username}`);
}
