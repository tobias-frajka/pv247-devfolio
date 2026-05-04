import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

// IPv4 explicit — Node's fetch resolves "localhost" to ::1 first; turso dev binds to 127.0.0.1.
const client = createClient({
  url: process.env.DATABASE_URL ?? 'http://127.0.0.1:8080',
  authToken: process.env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
