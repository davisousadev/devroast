import { sql } from 'drizzle-orm';
import { db } from '../index';

export async function createSubmission({
	code,
	language,
	roastMode,
	score,
}: {
	code: string;
	language: string;
	roastMode: boolean;
	score: number;
}) {
	const result = await db.execute(
		sql`INSERT INTO submissions (code, language, roast_mode, score) VALUES (${code}, ${language}, ${roastMode}, ${score}) RETURNING *`
	);
	return result.rows[0];
}

export async function createRoastIssue({
	submissionId,
	type,
	title,
	description,
	line,
}: {
	submissionId: string;
	type: 'critical' | 'warning' | 'good';
	title: string;
	description: string;
	line?: number;
}) {
	const result = await db.execute(
		sql`INSERT INTO roast_issues (submission_id, type, title, description, line) VALUES (${submissionId}, ${type}, ${title}, ${description}, ${line}) RETURNING *`
	);
	return result.rows[0];
}

export async function getLeaderboard(limit = 100) {
	const result = await db.execute(
		sql`
      SELECT 
        s.id,
        s.code,
        s.language,
        s.score,
        s.created_at,
        COUNT(ri.id) as issue_count,
        COALESCE(AVG(CASE WHEN ri.type = 'critical' THEN 1 ELSE 0 END), 0) as critical_count
      FROM submissions s
      LEFT JOIN roast_issues ri ON ri.submission_id = s.id
      WHERE s.score IS NOT NULL
      GROUP BY s.id
      ORDER BY s.score DESC
      LIMIT ${limit}
    `
	);
	return result.rows;
}

export async function getSubmissionById(id: string) {
	const result = await db.execute(
		sql`
      SELECT 
        s.*,
        json_agg(
          json_build_object(
            'id', ri.id,
            'type', ri.type,
            'title', ri.title,
            'description', ri.description,
            'line', ri.line
          )
        ) FILTER (WHERE ri.id IS NOT NULL) as issues
      FROM submissions s
      LEFT JOIN roast_issues ri ON ri.submission_id = s.id
      WHERE s.id = ${id}
      GROUP BY s.id
    `
	);
	return result.rows[0];
}
