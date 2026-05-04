import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './auth';

export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Tools', 'Other'] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const skill = sqliteTable(
  'skill',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    category: text('category').$type<SkillCategory>().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  table => [index('skill_user_id_idx').on(table.userId)]
);
