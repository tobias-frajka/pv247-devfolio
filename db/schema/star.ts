import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { user } from './auth';

export const STAR_IDENTITY_KINDS = ['user', 'anon', 'ip'] as const;
export type StarIdentityKind = (typeof STAR_IDENTITY_KINDS)[number];

export const profileStar = sqliteTable(
  'profile_star',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    profileUserId: text('profile_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    identityKey: text('identity_key').notNull(),
    identityKind: text('identity_kind', { enum: STAR_IDENTITY_KINDS }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  table => [
    uniqueIndex('profile_star_unique').on(table.profileUserId, table.identityKey),
    index('profile_star_by_created_at').on(table.createdAt, table.profileUserId)
  ]
);
