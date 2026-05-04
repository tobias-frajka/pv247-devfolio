import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './auth';

export const profile = sqliteTable('profile', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  displayName: text('display_name'),
  headline: text('headline'),
  bio: text('bio'),
  location: text('location'),
  avatarUrl: text('avatar_url'),
  availableForWork: integer('available_for_work', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
});
