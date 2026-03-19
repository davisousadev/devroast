import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/ui/code-block';
import { cn } from '@/lib/utils';

export interface LeaderboardRow {
	id: string;
	code: string;
	language: string;
	score: number;
	username: string;
	created_at: Date;
	issue_count: number;
	critical_count: number;
}

interface LeaderboardClientProps {
	items: LeaderboardRow[];
}

export function LeaderboardClient({ items }: LeaderboardClientProps) {
	const getScoreColor = (score: number) => {
		if (score < 3) return 'text-red-500';
		if (score < 6) return 'text-amber-500';
		return 'text-emerald-500';
	};

	const getRankStyles = (rank: number) => {
		if (rank === 1) return 'text-amber-500';
		if (rank === 2) return 'text-gray-400';
		if (rank === 3) return 'text-amber-700';
		return 'text-gray-600';
	};

	return (
		<div className="flex flex-col gap-5">
			{items.map((item, index) => {
				const rank = index + 1;
				const codeLines = item.code.split('\n').slice(0, 3);

				return (
					<div
						key={item.id}
						className="flex flex-col rounded border border-zinc-800 bg-zinc-900/50"
					>
						<div
							className="flex h-12 items-center justify-between border-b border-zinc-800 px-5"
							style={{ minHeight: '48px' }}
						>
							<div className="flex items-center gap-4">
								<span
									className={cn(
										'font-mono text-sm font-bold',
										getRankStyles(rank)
									)}
								>
									#{rank}
								</span>
								<span className="font-mono text-sm text-zinc-200">
									{item.username}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<Badge
									variant="warning"
									showDot={false}
									className="text-zinc-400"
								>
									{item.language}
								</Badge>
								<span
									className={cn(
										'font-mono text-sm font-bold',
										getScoreColor(item.score)
									)}
								>
									{item.score}/10
								</span>
							</div>
						</div>
						<CodeBlock
							code={codeLines.join('\n')}
							lang={item.language}
							showLineNumbers
							showHeader={false}
						/>
					</div>
				);
			})}
		</div>
	);
}
