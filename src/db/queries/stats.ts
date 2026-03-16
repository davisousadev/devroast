import { sql } from 'drizzle-orm';
import { db } from '../index';

export async function getStats() {
	const result = await db.execute(sql`SELECT * FROM stats WHERE id = 1`);
	return result.rows[0];
}

export async function updateStats() {
	await db.execute(
		sql`
      WITH submission_stats AS (
        SELECT 
          COUNT(*) as total,
          COALESCE(AVG(score), 0)::integer as avg_score
        FROM submissions
        WHERE score IS NOT NULL
      )
      INSERT INTO stats (id, total_codes_roasted, average_score, updated_at)
      VALUES (1, (SELECT total FROM submission_stats), (SELECT avg_score FROM submission_stats), NOW())
      ON CONFLICT (id) DO UPDATE SET
        total_codes_roasted = EXCLUDED.total_codes_roasted,
        average_score = EXCLUDED.average_score,
        updated_at = EXCLUDED.updated_at
    `
	);
	return getStats();
}

export async function initStats() {
	const existing = await getStats();
	if (!existing) {
		await db.execute(
			sql`INSERT INTO stats (id, total_codes_roasted, average_score) VALUES (1, 0, 0)`
		);
	}
}
