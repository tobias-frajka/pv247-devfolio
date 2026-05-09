import { z } from 'zod';

export const optionalUrl = z
  .union([
    z.literal(''),
    z.url().refine((u: string) => /^https?:/i.test(u), { message: 'Must be an http or https URL' })
  ])
  .optional();
