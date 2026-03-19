import type { ParsedIssue } from '@/services/roast/parser';

interface RoastIssueItemProps {
	issue: ParsedIssue;
}

export function RoastIssueItem({ issue }: RoastIssueItemProps) {
	const typeStyles = {
		critical: 'border-red-500/50 bg-red-500/5',
		warning: 'border-yellow-500/50 bg-yellow-500/5',
		good: 'border-emerald-500/50 bg-emerald-500/5',
	};

	const typeIcons = {
		critical: '🔥',
		warning: '⚠️',
		good: '✨',
	};

	const typeLabels = {
		critical: 'Critical',
		warning: 'Warning',
		good: 'Good',
	};

	return (
		<div className={`rounded border p-4 ${typeStyles[issue.type]}`}>
			<div className="flex items-center gap-2">
				<span className="text-lg">{typeIcons[issue.type]}</span>
				<span
					className={`rounded px-2 py-0.5 text-xs font-bold ${
						issue.type === 'critical'
							? 'bg-red-500/20 text-red-400'
							: issue.type === 'warning'
								? 'bg-yellow-500/20 text-yellow-400'
								: 'bg-emerald-500/20 text-emerald-400'
					}`}
				>
					{typeLabels[issue.type]}
				</span>
				{issue.line && (
					<span className="font-mono text-xs text-zinc-500">
						Line {issue.line}
					</span>
				)}
			</div>
			<h3 className="mt-2 font-mono text-sm font-bold text-zinc-200">
				{issue.title}
			</h3>
			<p className="mt-1 text-sm text-zinc-400">{issue.description}</p>
			{issue.suggestion && (
				<div className="mt-3 rounded bg-zinc-800/50 p-3">
					<span className="font-mono text-xs text-emerald-400">
						💡 {issue.suggestion}
					</span>
				</div>
			)}
		</div>
	);
}
