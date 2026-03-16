import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/ui/code-block';

export const metadata: Metadata = {
	title: 'Shame Leaderboard | DevRoast',
	description:
		'The most roasted code on the internet. View the worst submissions ranked by shame.',
};

const mockLeaderboardData = [
	{
		rank: 1,
		username: 'anon_0842',
		score: 1.2,
		language: 'javascript',
		code: [
			"eval(prompt('enter code'))",
			'document.write(response)',
			'// trust the user lol',
		],
		date: '2 hours ago',
	},
	{
		rank: 2,
		username: 'dev_guru',
		score: 1.8,
		language: 'typescript',
		code: [
			'if (x == true) { return true; }',
			'else if (x == false) { return false; }',
			'else { return !false; }',
		],
		date: '5 hours ago',
	},
	{
		rank: 3,
		username: 'sql_wizard',
		score: 2.1,
		language: 'sql',
		code: [
			'SELECT * FROM users WHERE 1=1',
			'-- TODO: add authentication',
			"DELETE FROM users WHERE id = 'all'",
		],
		date: '1 day ago',
	},
	{
		rank: 4,
		username: 'pythonic_ninja',
		score: 2.8,
		language: 'python',
		code: ['import os', 'os.system("rm -rf /")  # cleanup', 'exec(input())'],
		date: '2 days ago',
	},
	{
		rank: 5,
		username: 'rustacean_newbie',
		score: 3.1,
		language: 'rust',
		code: [
			'unsafe { *ptr = 42; }',
			'// who needs memory safety?',
			'println!("{:?}", unwrap_everything()));',
		],
		date: '3 days ago',
	},
];

function LeaderboardEntry({
	rank,
	username,
	score,
	language,
	code,
}: (typeof mockLeaderboardData)[number]) {
	const getScoreColor = () => {
		if (score < 3) return 'text-red-500';
		if (score < 6) return 'text-amber-500';
		return 'text-emerald-500';
	};

	const getRankStyles = () => {
		if (rank === 1) return 'text-amber-500';
		if (rank === 2) return 'text-gray-400';
		if (rank === 3) return 'text-amber-700';
		return 'text-gray-600';
	};

	return (
		<div className="flex flex-col rounded border border-zinc-800 bg-zinc-900/50">
			<div
				className="flex h-12 items-center justify-between border-b border-zinc-800 px-5"
				style={{ minHeight: '48px' }}
			>
				<div className="flex items-center gap-4">
					<span className={`font-mono text-sm font-bold ${getRankStyles()}`}>
						#{rank}
					</span>
					<span className="font-mono text-sm text-zinc-200">{username}</span>
				</div>
				<div className="flex items-center gap-3">
					<Badge variant="warning" showDot={false} className="text-zinc-400">
						{language}
					</Badge>
					<span className={`font-mono text-sm font-bold ${getScoreColor()}`}>
						{score}/10
					</span>
				</div>
			</div>
			<CodeBlock
				code={code.join('\n')}
				lang={language}
				showLineNumbers
				showHeader={false}
			/>
		</div>
	);
}

export default function LeaderboardPage() {
	const totalSubmissions = '2,847';
	const avgScore = '4.2';

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col px-10 pb-20 pt-16">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-mono text-3xl font-bold text-emerald-500">
							&gt;
						</span>
						<h1 className="font-mono text-3xl font-bold text-zinc-100">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-zinc-500">
						{'// the most roasted code on the internet'}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-zinc-600">
							{totalSubmissions} submissions
						</span>
						<span className="font-mono text-xs text-zinc-600">·</span>
						<span className="font-mono text-xs text-zinc-600">
							avg score: {avgScore}/10
						</span>
					</div>
				</section>

				<section className="flex flex-col gap-5">
					{mockLeaderboardData.map((entry) => (
						<LeaderboardEntry key={entry.rank} {...entry} />
					))}
				</section>
			</div>
		</main>
	);
}
