import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/ui/code-block';
import { ScoreRing } from '@/components/ui/score-ring';

export const metadata: Metadata = {
	title: 'Roast Result | DevRoast',
	description: 'Your code has been roasted.',
};

const mockResultData = {
	score: 3.5,
	verdict: 'needs_serious_help',
	roastTitle:
		'"this code looks like it was written during a power outage... in 2005."',
	language: 'javascript',
	lines: 7,
	code: [
		'function calculateSum(arr) {',
		'  let sum = 0;',
		'  for (let i = 0; i <= arr.length; i++) {',
		'    sum += arr[i];',
		'  }',
		'  return sum;',
		'}',
	],
	issues: [
		{
			title: 'Off-by-one error',
			description:
				'The loop condition uses `<=` instead of `<`, causing an out-of-bounds access on the last iteration.',
			severity: 'critical' as const,
		},
		{
			title: 'No input validation',
			description:
				"Function doesn't check if `arr` is actually an array or handle null/undefined.",
			severity: 'warning' as const,
		},
		{
			title: 'Missing return type',
			description:
				'Consider adding JSDoc or TypeScript annotations for better type safety.',
			severity: 'info' as const,
		},
		{
			title: 'Inefficient algorithm',
			description:
				'Use `reduce()` or `forEach()` for a more functional approach.',
			severity: 'info' as const,
		},
	],
	improvedCode: [
		'function calculateSum(arr) {',
		'  if (!Array.isArray(arr)) return 0;',
		'  return arr.reduce((sum, num) => sum + num, 0);',
		'}',
	],
};

interface IssueCardProps {
	title: string;
	description: string;
	severity: 'critical' | 'warning' | 'info';
}

function IssueCard({ title, description, severity }: IssueCardProps) {
	const severityConfig = {
		critical: {
			border: 'border-red-500/30',
			icon: '🔴',
		},
		warning: {
			border: 'border-amber-500/30',
			icon: '🟡',
		},
		info: {
			border: 'border-blue-500/30',
			icon: '🔵',
		},
	};

	const config = severityConfig[severity];

	return (
		<div
			className={`flex flex-col gap-3 rounded border p-5 ${config.border} bg-zinc-900/50`}
		>
			<div className="flex items-center gap-2">
				<span>{config.icon}</span>
				<span className="font-mono text-sm font-medium text-zinc-200">
					{title}
				</span>
			</div>
			<p className="font-mono text-xs text-zinc-500">{description}</p>
		</div>
	);
}

export default async function ResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await params;

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col px-10 pb-20 pt-10">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
				<section className="flex flex-col items-center gap-12">
					<div className="flex items-center gap-12">
						<ScoreRing score={mockResultData.score} size={180}>
							<div className="flex flex-col items-center">
								<span className="font-mono text-5xl font-bold text-amber-500">
									{mockResultData.score}
								</span>
								<span className="font-mono text-sm text-zinc-600">/10</span>
							</div>
						</ScoreRing>
						<div className="flex flex-col gap-4">
							<Badge variant="critical">
								verdict: {mockResultData.verdict}
							</Badge>
							<p className="font-mono text-xl leading-relaxed text-zinc-100">
								{mockResultData.roastTitle}
							</p>
							<div className="flex items-center gap-4">
								<span className="font-mono text-xs text-zinc-600">
									lang: {mockResultData.language}
								</span>
								<span className="font-mono text-xs text-zinc-600">{'·'}</span>
								<span className="font-mono text-xs text-zinc-600">
									{mockResultData.lines} lines
								</span>
							</div>
						</div>
					</div>
				</section>

				<div className="h-px w-full bg-zinc-800" />

				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-emerald-500">
							{'//'}
						</span>
						<span className="font-mono text-sm font-bold text-zinc-200">
							your_submission
						</span>
					</div>
					<CodeBlock
						code={mockResultData.code.join('\n')}
						lang={mockResultData.language}
						showLineNumbers
						showHeader={false}
					/>
				</section>

				<div className="h-px w-full bg-zinc-800" />

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-emerald-500">
							{'//'}
						</span>
						<span className="font-mono text-sm font-bold text-zinc-200">
							detailed_analysis
						</span>
					</div>
					<div className="grid grid-cols-2 gap-5">
						{mockResultData.issues.slice(0, 2).map((issue) => (
							<IssueCard key={issue.title} {...issue} />
						))}
					</div>
					<div className="grid grid-cols-2 gap-5">
						{mockResultData.issues.slice(2, 4).map((issue) => (
							<IssueCard key={issue.title} {...issue} />
						))}
					</div>
				</section>

				<div className="h-px w-full bg-zinc-800" />

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-emerald-500">
							{'//'}
						</span>
						<span className="font-mono text-sm font-bold text-zinc-200">
							suggested_fix
						</span>
					</div>
					<CodeBlock
						code={mockResultData.improvedCode.join('\n')}
						lang={mockResultData.language}
						showLineNumbers
						showHeader
						fileName="improved.js"
					/>
				</section>
			</div>
		</main>
	);
}
