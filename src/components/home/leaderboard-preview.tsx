import { Suspense } from 'react';
import { caller } from '@/server/trpc/server';
import type { LeaderboardItem } from './leaderboard-preview-client';
import { LeaderboardPreviewClient } from './leaderboard-preview-client';
import { LeaderboardPreviewSkeleton } from './leaderboard-preview-skeleton';

export async function LeaderboardPreview() {
	return (
		<Suspense fallback={<LeaderboardPreviewSkeleton />}>
			<LeaderboardPreviewServer />
		</Suspense>
	);
}

async function LeaderboardPreviewServer() {
	const items = (await caller.leaderboard.getTopWorst({
		limit: 3,
	})) as LeaderboardItem[];

	return <LeaderboardPreviewClient items={items} />;
}
