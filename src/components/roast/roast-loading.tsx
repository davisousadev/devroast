export function RoastLoading() {
	return (
		<div className="flex flex-col items-center gap-8 py-12">
			<div className="relative">
				<div className="h-52 w-52 animate-pulse rounded-full bg-zinc-800" />
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-44 w-44 animate-pulse rounded-full border-4 border-emerald-500/30" />
				</div>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-36 w-36 animate-pulse rounded-full border-4 border-yellow-500/30" />
				</div>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-28 w-28 animate-pulse rounded-full border-4 border-red-500/30" />
				</div>
			</div>
			<div className="flex flex-col items-center gap-2">
				<span className="font-mono text-lg font-bold text-zinc-200">
					Analyzing your code...
				</span>
				<span className="font-mono text-sm text-zinc-500">
					{Array.from({ length: 3 }).map((_, i) => (
						<span
							key={i}
							className="animate-pulse"
							style={{ animationDelay: `${i * 200}ms` }}
						>
							.
						</span>
					))}
				</span>
			</div>
			<div className="flex flex-col gap-2">
				<div className="h-4 w-48 animate-pulse rounded bg-zinc-800" />
				<div className="h-4 w-64 animate-pulse rounded bg-zinc-800" />
				<div className="h-4 w-56 animate-pulse rounded bg-zinc-800" />
			</div>
		</div>
	);
}
