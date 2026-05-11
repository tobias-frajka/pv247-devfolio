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

const USERNAME_RULES =
  'Use 3-20 characters: lowercase letters, digits, or hyphens. Must start with a letter.';

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, USERNAME_RULES)
  .max(20, USERNAME_RULES)
  .regex(USERNAME_PATTERN, USERNAME_RULES)
  .refine(v => !RESERVED.has(v), 'This username is reserved.');

export type UsernameInput = z.infer<typeof usernameSchema>;
