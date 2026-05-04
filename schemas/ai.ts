import { z } from 'zod';

import { SKILL_CATEGORIES } from '@/db/schema/skill';

export const generateBioSchema = z.object({
  role: z.string().trim().min(1).max(120),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  topSkills: z.array(z.string().trim().min(1).max(40)).max(10).default([])
});

export const improveDescriptionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  techStack: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  description: z.string().trim().min(1).max(2000)
});

export const suggestTitlesSchema = z.object({
  skills: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(40),
        category: z.enum(SKILL_CATEGORIES)
      })
    )
    .max(50)
});

export type GenerateBioInput = z.infer<typeof generateBioSchema>;
export type ImproveDescriptionInput = z.infer<typeof improveDescriptionSchema>;
export type SuggestTitlesInput = z.infer<typeof suggestTitlesSchema>;
