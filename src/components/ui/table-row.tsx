import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
	rank: string | number;
	score: string | number;
	code: string;
	language?: string;
}

const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
	(
		{ className, rank, score, code, language = 'javascript', ...props },
		ref
	) => {
		const getScoreColor = () => {
			const numScore =
				typeof score === 'number' ? score : parseFloat(String(score));
			if (numScore < 3) return 'text-red-500';
			if (numScore < 6) return 'text-amber-500';
			return 'text-emerald-500';
		};

		return (
			<div
				ref={ref}
				className={cn(
					'flex w-full items-center gap-6 border-b border-zinc-800 px-5 py-4',
					className
				)}
				{...props}
			>
				<div className="w-10 shrink-0">
					<span className="font-mono text-[13px] text-gray-600">#{rank}</span>
				</div>
				   <div className="w-15 shrink-0">
					<span
						className={cn('font-mono text-[13px] font-bold', getScoreColor())}
					>
						{score}
					</span>
				</div>
				<div className="min-w-0 flex-1">
					<span className="block truncate font-mono text-[12px] text-gray-500">
						{code}
					</span>
				</div>
				<div className="w-25 shrink-0">
					<span className="font-mono text-[12px] text-gray-600">
						{language}
					</span>
				</div>
			</div>
		);
	}
);

TableRow.displayName = 'TableRow';

export { TableRow };
