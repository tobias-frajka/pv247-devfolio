'use server';

import { db } from '@/db';

export async function getRandomUser(): Promise<string | null> {
  // Get all users (or we could limit to active ones)
  const users = await db.query.user.findMany();

  if (users.length === 0) {
    return null;
  }

  // Select a random user
  const randomUser = users[Math.floor(Math.random() * users.length)];

  return randomUser.username;
}
