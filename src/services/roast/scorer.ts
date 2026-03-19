import type { ParsedIssue } from './parser';

export function calculateScore(issues: ParsedIssue[]): number {
	let score = 100;

	for (const issue of issues) {
		if (issue.type === 'critical') {
			score -= issue.severity * 2;
		} else if (issue.type === 'warning') {
			score -= issue.severity;
		} else if (issue.type === 'good') {
			score += issue.severity;
		}
	}

	return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreLabel(score: number, roastMode: boolean): string {
	if (roastMode) {
		if (score < 20) return 'A new record. Literally unrepairable.';
		if (score < 40) return 'Congratulations, you reached a new bottom.';
		if (score < 60) return 'Mediocrity has a new champion.';
		if (score < 80) return 'Not terrible... for you, at least.';
		if (score < 95) return 'Actually... this is decent. Suspicious.';
		return 'Wait, did you copy this? No way this is yours.';
	}

	if (score < 30) return "There's work to do, but we all start somewhere.";
	if (score < 50) return "Some issues found, but nothing a refactor can't fix.";
	if (score < 70) return "Good effort! A few improvements and it'll be solid.";
	if (score < 85) return 'Nice code! Just minor polish needed.';
	if (score < 95) return "Excellent work! You're on the right track.";
	return "Top-tier code! You might actually know what you're doing.";
}
