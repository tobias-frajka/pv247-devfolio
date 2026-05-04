import { z } from 'zod';

import { optionalUrl } from './shared';

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  techStack: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl
});

export type ProjectInput = z.infer<typeof projectSchema>;
