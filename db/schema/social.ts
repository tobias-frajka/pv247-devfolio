import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { user } from './auth';

export const SOCIAL_PLATFORMS = ['github', 'linkedin', 'x', 'website', 'email'] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const social = sqliteTable(
  'social',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    platform: text('platform').$type<SocialPlatform>().notNull(),
    url: text('url').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  table => [uniqueIndex('social_user_platform_unique').on(table.userId, table.platform)]
);
