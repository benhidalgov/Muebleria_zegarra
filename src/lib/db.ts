import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from '@/db/schema';

// Use the Vercel Postgres pool for connection
// This handles connection pooling automatically in serverless environments
export const db = drizzle(sql, { schema });
