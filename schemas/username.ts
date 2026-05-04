import { z } from 'zod';

export const USERNAME_PATTERN = /^[a-z][a-z0-9-]*$/;

const RESERVED = new Set([
  'admin',
  'api',
  'auth',
  'dashboard',
  'devfolio',
  'login',
  'logout',
  'onboarding',
  'profile',
  'settings',
  'signin',
  'signout',
  'signup',
  'www'
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(20)
  .regex(USERNAME_PATTERN, 'must start with a letter; lowercase letters, digits, hyphens')
  .refine(v => !RESERVED.has(v), 'this username is reserved');

export type UsernameInput = z.infer<typeof usernameSchema>;
