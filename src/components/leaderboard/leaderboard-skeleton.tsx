import { cn } from '@/lib/utils';

export function LeaderboardSkeleton() {
	return (
		<div className="flex flex-col gap-5">
			{[...Array(20)].map((_, i) => (
				<div
					key={i}
					className="flex flex-col rounded border border-zinc-800 bg-zinc-900/50"
				>
					<div className="flex h-12 items-center justify-between border-b border-zinc-800 px-5">
						<div className="flex items-center gap-4">
							<div className="h-5 w-8 animate-pulse rounded bg-zinc-800" />
							<div className="h-5 w-24 animate-pulse rounded bg-zinc-800" />
						</div>
						<div className="flex items-center gap-3">
							<div className="h-5 w-20 animate-pulse rounded bg-zinc-800" />
							<div className="h-5 w-12 animate-pulse rounded bg-zinc-800" />
						</div>
					</div>
					<div className={cn('flex flex-col gap-2 p-5')}>
						<div className="flex gap-4">
							<div className="h-4 w-8 animate-pulse rounded bg-zinc-800" />
							<div className="h-4 w-full max-w-3xl animate-pulse rounded bg-zinc-800" />
						</div>
						<div className="flex gap-4">
							<div className="h-4 w-8 animate-pulse rounded bg-zinc-800" />
							<div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-800" />
						</div>
						<div className="flex gap-4">
							<div className="h-4 w-8 animate-pulse rounded bg-zinc-800" />
							<div className="h-4 w-full max-w-xl animate-pulse rounded bg-zinc-800" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
