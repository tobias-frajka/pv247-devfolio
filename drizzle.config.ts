import { readFileSync } from 'node:fs';

import { defineConfig } from 'drizzle-kit';

// drizzle-kit doesn't auto-load .env.local. Pull it in so DATABASE_URL matches
// what the Next.js app uses at runtime — same connection, no schema drift.
try {
  const raw = readFileSync('.env.local', 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch {
  // .env.local missing — fall back to defaults below.
}

const url = process.env.DATABASE_URL ?? 'http://127.0.0.1:8080';
const isFile = url.startsWith('file:');

export default defineConfig({
  schema: './db/schema',
  out: './drizzle',
  dialect: isFile ? 'sqlite' : 'turso',
  // Turso dialect requires a non-empty authToken even though local turso dev ignores it.
  dbCredentials: isFile ? { url } : { url, authToken: process.env.DATABASE_AUTH_TOKEN || 'local' }
});
