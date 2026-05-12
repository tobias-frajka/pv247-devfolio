'use server';

import { and, eq, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { project } from '@/db/schema';
import { byOwner, requireOwnership, requireUsername } from '@/lib/dal';
import { projectSchema } from '@/schemas/project';

export async function createProject(input: unknown) {
  const session = await requireUsername();
  const data = projectSchema.parse(input);

  const [row] = await db
    .insert(project)
    .values({ ...data, userId: session.user.id })
    .returning();

  revalidatePath('/dashboard/projects');
  revalidatePath(`/${session.user.username}`);
  return row;
}

export async function updateProject(id: string, input: unknown) {
  const existing = await db.query.project.findFirst({ where: eq(project.id, id) });
  const { session } = await requireOwnership(existing, '/dashboard/projects');
  const data = projectSchema.parse(input);

  const [row] = await db
    .update(project)
    .set(data)
    .where(byOwner(project, id, session.user.id))
    .returning();

  revalidatePath('/dashboard/projects');
  if (session.user.username) revalidatePath(`/${session.user.username}`);
  return row;
}

export async function deleteProject(id: string) {
  const existing = await db.query.project.findFirst({ where: eq(project.id, id) });
  const { session } = await requireOwnership(existing, '/dashboard/projects');

  await db.delete(project).where(byOwner(project, id, session.user.id));

  revalidatePath('/dashboard/projects');
  if (session.user.username) revalidatePath(`/${session.user.username}`);
}

export async function reorderProjects(orderedIds: string[]) {
  const session = await requireUsername();
  if (orderedIds.length === 0) return;

  const owned = await db.query.project.findMany({
    where: eq(project.userId, session.user.id),
    columns: { id: true }
  });
  const ownedIds = new Set(owned.map(p => p.id));
  if (orderedIds.some(id => !ownedIds.has(id))) {
    throw new Error('Forbidden');
  }

  const cases = orderedIds.map((id, index) => sql`when ${id} then ${index}`);
  await db
    .update(project)
    .set({ sortOrder: sql`case ${project.id} ${sql.join(cases, sql` `)} end` })
    .where(and(eq(project.userId, session.user.id), inArray(project.id, orderedIds)));

  revalidatePath('/dashboard/projects');
  revalidatePath(`/${session.user.username}`);
}
