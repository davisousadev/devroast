import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const roastIssueType = pgEnum('roast_issue_type', [
	'critical',
	'warning',
	'good',
]);

export const submissions = pgTable('submissions', {
	id: uuid('id').primaryKey().defaultRandom(),
	code: text('code').notNull(),
	language: varchar('language', { length: 50 }).notNull(),
	roastMode: boolean('roast_mode').notNull().default(true),
	score: integer('score'),
	username: varchar('username', { length: 100 }).notNull().default('anonymous'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const roastResults = pgTable('roast_results', {
	id: uuid('id').primaryKey().defaultRandom(),
	submissionId: uuid('submission_id')
		.notNull()
		.references(() => submissions.id),
	roastMode: boolean('roast_mode').notNull(),
	summary: text('summary').notNull(),
	score: integer('score').notNull(),
	rawResponse: text('raw_response'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const roastIssues = pgTable('roast_issues', {
	id: uuid('id').primaryKey().defaultRandom(),
	submissionId: uuid('submission_id')
		.notNull()
		.references(() => submissions.id),
	roastResultId: uuid('roast_result_id')
		.notNull()
		.references(() => roastResults.id),
	type: roastIssueType('type').notNull(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	line: integer('line'),
	suggestion: text('suggestion'),
	severity: integer('severity').notNull().default(5),
});

export const stats = pgTable('stats', {
	id: serial('id').primaryKey(),
	totalCodesRoasted: integer('total_codes_roasted').notNull().default(0),
	averageScore: integer('average_score').notNull().default(0),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type RoastIssue = typeof roastIssues.$inferSelect;
export type NewRoastIssue = typeof roastIssues.$inferInsert;
export type RoastResult = typeof roastResults.$inferSelect;
export type NewRoastResult = typeof roastResults.$inferInsert;
export type Stats = typeof stats.$inferSelect;
export type NewStats = typeof stats.$inferInsert;
