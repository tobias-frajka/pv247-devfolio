import { z } from 'zod';

import { SOCIAL_PLATFORMS } from '@/db/schema/social';

export const socialSchema = z
  .object({
    platform: z.enum(SOCIAL_PLATFORMS),
    url: z.string().trim().min(1)
  })
  .refine(
    v => {
      if (v.platform === 'email') return z.email().safeParse(v.url).success;
      return z.url().safeParse(v.url).success;
    },
    { path: ['url'], message: 'invalid url for the chosen platform' }
  );

export type SocialInput = z.infer<typeof socialSchema>;
