import { z } from 'zod';

import { SKILL_CATEGORIES } from '@/db/schema/skill';

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(40),
  category: z.enum(SKILL_CATEGORIES)
});

export type SkillInput = z.infer<typeof skillSchema>;
