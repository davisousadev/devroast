interface RoastSummaryProps {
	summary: string;
	roastMode: boolean;
}

export function RoastSummary({ summary, roastMode }: RoastSummaryProps) {
	return (
		<div className="flex flex-col gap-3 rounded border border-zinc-800 bg-zinc-900/50 p-5">
			<div className="flex items-center gap-2">
				<span className="text-lg">{roastMode ? '🔥' : '📝'}</span>
				<span className="font-mono text-sm font-bold text-zinc-200">
					{roastMode ? 'The Verdict' : 'Summary'}
				</span>
			</div>
			<p className="font-mono text-sm leading-relaxed text-zinc-300">
				{summary}
			</p>
		</div>
	);
}
