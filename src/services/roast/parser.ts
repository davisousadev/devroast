export interface ParsedIssue {
	type: 'critical' | 'warning' | 'good';
	title: string;
	description: string;
	line: number | null;
	suggestion: string | null;
	severity: number;
}

export interface ParsedRoastResponse {
	summary: string;
	score: number;
	issues: ParsedIssue[];
}

export function parseLLMResponse(response: string): ParsedRoastResponse {
	let jsonStr = response.trim();

	jsonStr = jsonStr.replace(/```json\n?/g, '');
	jsonStr = jsonStr.replace(/```\n?/g, '');
	jsonStr = jsonStr.trim();

	if (!jsonStr.startsWith('{')) {
		const firstBrace = jsonStr.indexOf('{');
		if (firstBrace !== -1) {
			jsonStr = jsonStr.slice(firstBrace);
		}
	}

	const lastBrace = jsonStr.lastIndexOf('}');
	if (lastBrace !== -1) {
		jsonStr = jsonStr.slice(0, lastBrace + 1);
	}

	try {
		const parsed = JSON.parse(jsonStr);

		const issues = (parsed.issues || []).map(
			(issue: Partial<ParsedIssue> & { type?: string }) => ({
				type:
					issue.type === 'critical' ||
					issue.type === 'warning' ||
					issue.type === 'good'
						? issue.type
						: 'warning',
				title: String(issue.title || 'Untitled Issue'),
				description: String(issue.description || ''),
				line: issue.line != null ? Number(issue.line) : null,
				suggestion: issue.suggestion != null ? String(issue.suggestion) : null,
				severity:
					issue.severity != null
						? Math.max(1, Math.min(10, Number(issue.severity)))
						: 5,
			})
		);

		return {
			summary: String(parsed.summary || 'Code analyzed.'),
			score: Math.max(0, Math.min(100, Number(parsed.score || 50))),
			issues,
		};
	} catch (error) {
		console.error('Failed to parse LLM response:', error);
		console.error('Raw response:', response);

		return {
			summary: 'Analysis completed with some parsing issues.',
			score: 50,
			issues: [
				{
					type: 'warning',
					title: 'Parse Warning',
					description:
						'The AI response had formatting issues, but the roast was still generated.',
					line: null,
					suggestion: 'Try submitting the code again.',
					severity: 3,
				},
			],
		};
	}
}
