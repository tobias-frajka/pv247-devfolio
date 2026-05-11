import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './auth';

// One row per (user, UTC day). Old rows are harmless; can be GC'd by a periodic
// job if the table ever grows enough to matter.
export const aiUsage = sqliteTable(
  'ai_usage',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    dayKey: text('day_key').notNull(),
    count: integer('count').notNull().default(0)
  },
  table => [primaryKey({ columns: [table.userId, table.dayKey] })]
);
