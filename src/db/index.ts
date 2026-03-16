import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const pool = new pg.Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://devroast:devroast123@localhost:5433/devroast',
});

export const db = drizzle(pool, { schema });
