'use server';

import { APIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { requireSession, requireUsername } from '@/lib/dal';
import { usernameSchema } from '@/schemas/username';

type ClaimError = { ok: false; code: 'taken' | 'invalid' };

const claimError = (code: ClaimError['code']): ClaimError => ({ ok: false, code });

const isUsernameTakenError = (err: unknown) =>
  err instanceof APIError && err.body?.code === 'USERNAME_IS_ALREADY_TAKEN';

async function applyUsername(value: string) {
  await auth.api.updateUser({
    body: { username: value, displayUsername: value },
    headers: await headers()
  });
}

export async function claimUsername(rawUsername: string) {
  const session = await requireSession();

  const parsed = usernameSchema.safeParse(rawUsername);
  if (!parsed.success) return claimError('invalid');
  const username = parsed.data;

  const taken = await db.query.user.findFirst({
    where: eq(user.username, username),
    columns: { id: true }
  });
  if (taken && taken.id !== session.user.id) return claimError('taken');

  try {
    await applyUsername(username);
  } catch (err) {
    if (isUsernameTakenError(err)) return claimError('taken');
    throw err;
  }

  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
  redirect('/dashboard/profile');
}

export async function changeUsername(rawUsername: string) {
  const session = await requireUsername();
  const previous = session.user.username;

  const parsed = usernameSchema.safeParse(rawUsername);
  if (!parsed.success) return claimError('invalid');
  const username = parsed.data;
  if (username === previous) return { ok: true as const };

  const taken = await db.query.user.findFirst({
    where: eq(user.username, username),
    columns: { id: true }
  });
  if (taken && taken.id !== session.user.id) return claimError('taken');

  try {
    await applyUsername(username);
  } catch (err) {
    if (isUsernameTakenError(err)) return claimError('taken');
    throw err;
  }

  revalidatePath('/dashboard/settings');
  revalidatePath(`/${previous}`);
  revalidatePath(`/${username}`);
  return { ok: true as const };
}
