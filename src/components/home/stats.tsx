'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/server/trpc/client';

export function Stats() {
	const { data } = useQuery({
		...trpc.stats.get.queryOptions(),
		staleTime: 60 * 1000,
	});

	const totalCodes =
		(data as { total_codes_roasted?: number })?.total_codes_roasted ?? 0;
	const avgScore = (data as { average_score?: number })?.average_score ?? 0;

	return (
		<div className="flex items-center justify-center gap-6">
			<span className="font-mono text-xs text-gray-600">
				{totalCodes.toLocaleString('en-US')} codes roasted
			</span>
			<span className="font-mono text-xs text-gray-600">·</span>
			<span className="font-mono text-xs text-gray-600">
				avg score: {avgScore}/10
			</span>
		</div>
	);
}
