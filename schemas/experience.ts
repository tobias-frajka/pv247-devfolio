import { z } from 'zod';

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1).max(120),
    role: z.string().trim().min(1).max(120),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    description: z.string().trim().max(2000).optional().or(z.literal(''))
  })
  .refine(v => !v.endDate || v.endDate >= v.startDate, {
    path: ['endDate'],
    message: 'end date must be after start date'
  });

export type ExperienceInput = z.infer<typeof experienceSchema>;
