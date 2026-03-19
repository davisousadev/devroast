import 'server-only';
import { createRoastIssue, createRoastResult } from '@/db/queries/roast';
import { updateStats } from '@/db/queries/stats';
import { createSubmission } from '@/db/queries/submissions';
import { geminiChat } from '@/lib/llm/gemini';
import { type ParsedRoastResponse, parseLLMResponse } from './parser';
import { PROMPTS } from './prompts';
import { calculateScore } from './scorer';

export interface ProcessRoastInput {
	code: string;
	language: string;
	roastMode: boolean;
	username?: string;
}

export interface RoastResultData {
	id: string;
	submissionId: string;
	roastMode: boolean;
	summary: string;
	score: number;
	code: string;
	language: string;
	username: string;
	issues: ParsedRoastResponse['issues'];
	createdAt: Date;
}

function toStr(value: unknown): string {
	if (typeof value === 'string') return value;
	if (value instanceof Date) return value.toISOString();
	return String(value ?? '');
}

export async function processRoast({
	code,
	language,
	roastMode,
	username = 'anonymous',
}: ProcessRoastInput): Promise<RoastResultData> {
	const systemPrompt = roastMode ? PROMPTS.ROAST : PROMPTS.NORMAL;

	const response = await geminiChat({
		model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
		messages: [
			{ role: 'user', content: systemPrompt },
			{
				role: 'user',
				content: `Analyze this ${language} code and respond ONLY with valid JSON:\n\n\`\`\`${language}\n${code}\n\`\`\``,
			},
		],
	});

	const parsed = parseLLMResponse(response);

	const submission = await createSubmission({
		code,
		language,
		roastMode,
		score: parsed.score,
		username,
	});

	const finalScore = calculateScore(parsed.issues);

	const roastResult = await createRoastResult({
		submissionId: submission.id as string,
		roastMode,
		summary: parsed.summary,
		score: finalScore,
		rawResponse: response,
	});

	for (const issue of parsed.issues) {
		await createRoastIssue({
			submissionId: submission.id as string,
			roastResultId: roastResult.id as string,
			type: issue.type,
			title: issue.title,
			description: issue.description,
			line: issue.line,
			suggestion: issue.suggestion,
			severity: issue.severity,
		});
	}

	await updateStats();

	return {
		id: toStr(roastResult.id),
		submissionId: toStr(submission.id),
		roastMode,
		summary: parsed.summary,
		score: finalScore,
		code,
		language,
		username,
		issues: parsed.issues,
		createdAt: new Date(toStr(roastResult.createdAt)),
	};
}
