import { z } from 'zod';

export const optionalUrl = z.union([z.literal(''), z.url()]);
