import { cn } from '@/lib/utils';

export function StatsSkeleton() {
	return (
		<div className={cn('flex items-center justify-center gap-6')}>
			<span className="font-mono text-xs text-gray-600">
				<span className="inline-block w-20 animate-pulse rounded bg-gray-700">
					&nbsp;
				</span>{' '}
				codes roasted
			</span>
			<span className="font-mono text-xs text-gray-600">·</span>
			<span className="font-mono text-xs text-gray-600">
				avg score:{' '}
				<span className="inline-block w-12 animate-pulse rounded bg-gray-700">
					&nbsp;
				</span>
				/10
			</span>
		</div>
	);
}
