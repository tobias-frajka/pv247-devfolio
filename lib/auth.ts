import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { USERNAME_PATTERN } from '@/schemas/username';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite', schema }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ['user:email']
    }
  },
  user: {
    deleteUser: { enabled: true }
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
      usernameValidator: value => USERNAME_PATTERN.test(value)
    })
  ]
});

export type Session = typeof auth.$Infer.Session;
