import { z } from 'zod';

import { optionalUrl } from './shared';

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80).optional().or(z.literal('')),
  headline: z.string().trim().max(120).optional().or(z.literal('')),
  bio: z.string().trim().max(2000).optional().or(z.literal('')),
  location: z.string().trim().max(80).optional().or(z.literal('')),
  avatarUrl: optionalUrl,
  availableForWork: z.boolean()
});

export type ProfileInput = z.infer<typeof profileSchema>;
