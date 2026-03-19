import { cn } from '@/lib/utils';

export interface LeaderboardItem {
	id: string;
	code: string;
	language: string;
	score: number;
	created_at: Date;
	issue_count: number;
	critical_count: number;
}

interface LeaderboardPreviewClientProps {
	items: LeaderboardItem[];
	totalCount?: number;
}

export function LeaderboardPreviewClient({
	items,
	totalCount,
}: LeaderboardPreviewClientProps) {
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

	const formatCode = (code: string) => {
		const lines = code.split('\n').slice(0, 2);
		return lines;
	};

	return (
		<div className="flex w-240 flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-mono text-sm font-bold text-zinc-200">
					<span className="text-emerald-500">{'//'}</span>
					<span>shame_leaderboard</span>
				</h2>
				<a
					href="/leaderboard"
					className="flex items-center gap-1 rounded border border-zinc-800 px-3 py-1.5 font-mono text-xs text-gray-500 transition-colors hover:border-gray-600 hover:text-zinc-200"
				>
					$ view_all &gt;&gt;
				</a>
			</div>
			<p className="font-mono text-xs text-gray-600">
				{`// the worst code on the internet, ranked by shame`}
			</p>
			<div className="flex flex-col rounded-md border border-zinc-800">
				<div className="flex h-10 items-center bg-zinc-950 px-5">
					<span className="w-12.5 font-mono text-xs font-medium text-gray-600">
						#
					</span>
					<span className="w-17.5 font-mono text-xs font-medium text-gray-600">
						score
					</span>
					<span className="flex-1 font-mono text-xs font-medium text-gray-600">
						code
					</span>
					<span className="w-25 font-mono text-xs font-medium text-gray-600">
						lang
					</span>
				</div>
				{items.map((item, index) => (
					<div
						key={item.id}
						className={cn(
							'flex px-5 py-4',
							index < items.length - 1 && 'border-b border-zinc-800'
						)}
					>
						<div className="w-12.5">
							<span
								className={cn('font-mono text-xs', getRankStyles(index + 1))}
							>
								{index + 1}
							</span>
						</div>
						<div className="w-17.5">
							<span
								className={cn(
									'font-mono text-xs font-bold',
									getScoreColor(item.score)
								)}
							>
								{item.score}
							</span>
						</div>
						<div className="flex flex-1 flex-col gap-0.5">
							{formatCode(item.code).map((line, i) => (
								<span
									key={i}
									className={cn(
										'block truncate font-mono text-xs',
										line.includes('//') ? 'text-gray-500' : 'text-zinc-200'
									)}
								>
									{line}
								</span>
							))}
						</div>
						<div className="w-25">
							<span className="font-mono text-xs text-gray-500">
								{item.language}
							</span>
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center px-4 py-4">
				<span className="font-mono text-xs text-gray-600 hover:text-gray-500">
					{typeof totalCount === 'number'
						? <a href="/leaderboard" className="">
								showing top {items.length} of {totalCount.toLocaleString('en-US')} · view full leaderboard &gt;&gt;
							</a>
						: <a href="/leaderboard" className="">
								showing top {items.length} · view full leaderboard &gt;&gt;
							</a>}
				</span>
			</div>
		</div>
	);
}
