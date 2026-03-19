import { sql } from 'drizzle-orm';
import { db } from '@/db/index';
import type { RoastIssue, RoastResult } from '@/db/schema';

export interface CreateRoastResultInput {
	submissionId: string;
	roastMode: boolean;
	summary: string;
	score: number;
	rawResponse: string;
}

export async function createRoastResult(input: CreateRoastResultInput) {
	const result = await db.execute(
		sql`INSERT INTO roast_results (submission_id, roast_mode, summary, score, raw_response) VALUES (${input.submissionId}, ${input.roastMode}, ${input.summary}, ${input.score}, ${input.rawResponse}) RETURNING *`
	);
	return result.rows[0] as RoastResult;
}

export interface CreateRoastIssueInput {
	submissionId: string;
	roastResultId: string;
	type: 'critical' | 'warning' | 'good';
	title: string;
	description: string;
	line?: number | null;
	suggestion?: string | null;
	severity: number;
}

export async function createRoastIssue(input: CreateRoastIssueInput) {
	const result = await db.execute(
		sql`INSERT INTO roast_issues (submission_id, roast_result_id, type, title, description, line, suggestion, severity) VALUES (${input.submissionId}, ${input.roastResultId}, ${input.type}, ${input.title}, ${input.description}, ${input.line}, ${input.suggestion}, ${input.severity}) RETURNING *`
	);
	return result.rows[0] as RoastIssue;
}

export async function getRoastResultById(id: string) {
	const result = await db.execute(
		sql`
      SELECT 
        rr.*,
        s.code,
        s.language,
        s.username,
        s.created_at as submission_created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ri.id,
              'type', ri.type,
              'title', ri.title,
              'description', ri.description,
              'line', ri.line,
              'suggestion', ri.suggestion,
              'severity', ri.severity
            )
          ) FILTER (WHERE ri.id IS NOT NULL),
          '[]'
        ) as issues
      FROM roast_results rr
      JOIN submissions s ON s.id = rr.submission_id
      LEFT JOIN roast_issues ri ON ri.roast_result_id = rr.id
      WHERE rr.id = ${id}
      GROUP BY rr.id, s.id
    `
	);
	return result.rows[0];
}

export async function getRoastHistoryByUsername(username: string) {
	const result = await db.execute(
		sql`
      SELECT 
        rr.id,
        rr.roast_mode,
        rr.summary,
        rr.score,
        rr.created_at,
        s.code,
        s.language,
        s.username
      FROM roast_results rr
      JOIN submissions s ON s.id = rr.submission_id
      WHERE s.username = ${username}
      ORDER BY rr.created_at DESC
      LIMIT 20
    `
	);
	return result.rows;
}

export async function getRoastResults(limit = 20) {
	const result = await db.execute(
		sql`
      SELECT 
        rr.*,
        s.code,
        s.language,
        s.username,
        s.created_at as submission_created_at
      FROM roast_results rr
      JOIN submissions s ON s.id = rr.submission_id
      ORDER BY rr.created_at DESC
      LIMIT ${limit}
    `
	);
	return result.rows;
}
