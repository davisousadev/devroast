import type { ParsedIssue } from '@/services/roast/parser';
import { RoastIssueItem } from './roast-issue-item';

interface RoastIssuesProps {
	issues: ParsedIssue[];
}

export function RoastIssues({ issues }: RoastIssuesProps) {
	const criticalIssues = issues.filter((i) => i.type === 'critical');
	const warningIssues = issues.filter((i) => i.type === 'warning');
	const goodIssues = issues.filter((i) => i.type === 'good');

	return (
		<div className="flex flex-col gap-6">
			{goodIssues.length > 0 && (
				<div className="flex flex-col gap-3">
					<h3 className="flex items-center gap-2 font-mono text-sm font-bold text-emerald-500">
						<span>✨</span>
						<span>Well Done!</span>
					</h3>
					<div className="flex flex-col gap-2">
						{goodIssues.map((issue, index) => (
							<RoastIssueItem key={`good-${index}`} issue={issue} />
						))}
					</div>
				</div>
			)}

			{warningIssues.length > 0 && (
				<div className="flex flex-col gap-3">
					<h3 className="flex items-center gap-2 font-mono text-sm font-bold text-yellow-500">
						<span>⚠️</span>
						<span>Warnings ({warningIssues.length})</span>
					</h3>
					<div className="flex flex-col gap-2">
						{warningIssues.map((issue, index) => (
							<RoastIssueItem key={`warning-${index}`} issue={issue} />
						))}
					</div>
				</div>
			)}

			{criticalIssues.length > 0 && (
				<div className="flex flex-col gap-3">
					<h3 className="flex items-center gap-2 font-mono text-sm font-bold text-red-500">
						<span>🔥</span>
						<span>Critical Issues ({criticalIssues.length})</span>
					</h3>
					<div className="flex flex-col gap-2">
						{criticalIssues.map((issue, index) => (
							<RoastIssueItem key={`critical-${index}`} issue={issue} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
