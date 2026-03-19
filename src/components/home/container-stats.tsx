import { Suspense } from 'react';
import { Stats } from './stats';
import { StatsSkeleton } from './stats-skeleton';

export function ContainerStats() {
	return (
		<div className="mt-auto py-10">
			<Suspense fallback={<StatsSkeleton />}>
				<Stats />
			</Suspense>
		</div>
	);
}
