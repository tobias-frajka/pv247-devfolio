'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { requireSession } from '@/lib/dal';

export async function signOutAction() {
  await requireSession();
  await auth.api.signOut({ headers: await headers() });
  redirect('/');
}

export async function deleteAccount() {
  const session = await requireSession();
  const username = session.user.username;

  await auth.api.deleteUser({
    body: {},
    headers: await headers()
  });

  revalidatePath('/');
  if (username) revalidatePath(`/${username}`);
  redirect('/');
}
