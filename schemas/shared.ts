import { z } from 'zod';

// Empty string OR an http(s) URL. Shared between server schemas (where the field is
// optional via `.optional()`) and per-platform form schemas (where blank means "no
// link for this platform").
export const httpUrl = z.union([
  z.literal(''),
  z.url().refine((u: string) => /^https?:/i.test(u), { message: 'Must be an http or https URL' })
]);

export const optionalUrl = httpUrl.optional();
