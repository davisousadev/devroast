import { cn } from '@/lib/utils';

export function LeaderboardPreviewSkeleton() {
	return (
		<div className="flex w-[60rem] flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="font-mono text-sm font-bold text-emerald-500">
						{'//'}
					</span>
					<span className="font-mono text-sm font-bold text-zinc-200">
						shame_leaderboard
					</span>
				</div>
				<div className="h-8 w-24 animate-pulse rounded border border-zinc-800 bg-zinc-900" />
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
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className={cn(
							'flex px-5 py-4',
							i < 3 && 'border-b border-zinc-800'
						)}
					>
						<div className="w-12.5">
							<div className="h-4 w-6 animate-pulse rounded bg-gray-700" />
						</div>
						<div className="w-17.5">
							<div className="h-4 w-10 animate-pulse rounded bg-gray-700" />
						</div>
						<div className="flex flex-1 flex-col gap-1">
							<div className="h-4 w-3/4 animate-pulse rounded bg-gray-700" />
							<div className="h-4 w-1/2 animate-pulse rounded bg-gray-700" />
						</div>
						<div className="w-25">
							<div className="h-4 w-16 animate-pulse rounded bg-gray-700" />
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center px-4 py-4">
				<div className="h-4 w-64 animate-pulse rounded bg-gray-700" />
			</div>
		</div>
	);
}
