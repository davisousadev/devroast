import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const mockLeaderboardData = [
	{
		rank: 1,
		score: 1.2,
		code: [
			'eval(prompt("enter code"))',
			'document.write(response)',
			'// trust the user lol',
		],
		language: 'javascript',
	},
	{
		rank: 2,
		score: 1.8,
		code: [
			'if (x == true) { return true; }',
			'else if (x == false) { return false; }',
			'else { return !false; }',
		],
		language: 'typescript',
	},
	{
		rank: 3,
		score: 2.1,
		code: ['SELECT * FROM users WHERE 1=1', '-- TODO: add authentication'],
		language: 'sql',
	},
];

const LeaderboardPreview = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn('flex w-240 flex-col gap-6', className)}
			{...props}
		>
			<div className="flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-mono text-sm font-bold text-zinc-200">
					<span className="text-emerald-500">{'//'}</span>
					<span>shame_leaderboard</span>
				</h2>
				<a
					href="#"
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
				{mockLeaderboardData.map((item, index) => (
					<div
						key={item.rank}
						className={cn(
							'flex px-5 py-4',
							index < mockLeaderboardData.length - 1 &&
								'border-b border-zinc-800'
						)}
					>
						<div className="w-12.5">
							<span
								className={cn(
									'font-mono text-xs',
									item.rank === 1 ? 'text-amber-500' : 'text-gray-500'
								)}
							>
								{item.rank}
							</span>
						</div>
						<div className="w-17.5">
							<span className="font-mono text-xs font-bold text-red-500">
								{item.score}
							</span>
						</div>
						<div className="flex flex-1 flex-col gap-0.5">
							{item.code.map((line, i) => (
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
				<span className="font-mono text-xs text-gray-600">
					showing top 3 of 2,847 · view full leaderboard &gt;&gt;
				</span>
			</div>
		</div>
	);
});

LeaderboardPreview.displayName = 'LeaderboardPreview';

export { LeaderboardPreview };
