import { Suspense } from 'react';
import { LeaderboardClient } from '@/components/leaderboard/leaderboard-client';
import { LeaderboardSkeleton } from '@/components/leaderboard/leaderboard-skeleton';
import { caller } from '@/server/trpc/server';

export const metadata = {
	title: 'Shame Leaderboard | DevRoast',
	description:
		'The most roasted code on the internet. View the worst submissions ranked by shame.',
};

interface Stats {
	total_codes_roasted: number;
	average_score: number;
}

export default async function LeaderboardPage() {
	const [items, statsData] = await Promise.all([
		caller.leaderboard.getTopWorst({ limit: 20 }),
		caller.stats.get(),
	]);

	const stats = statsData as unknown as Stats | null;

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col px-10 pb-20 pt-16">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-mono text-3xl font-bold text-emerald-500">
							&gt;
						</span>
						<h1 className="font-mono text-3xl font-bold text-zinc-100">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-zinc-500">
						{'// the most roasted code on the internet'}
					</p>
					{stats && (
						<div className="flex items-center gap-2">
							<span className="font-mono text-xs text-zinc-600">
								{stats.total_codes_roasted.toLocaleString('en-US')} submissions
							</span>
							<span className="font-mono text-xs text-zinc-600">·</span>
							<span className="font-mono text-xs text-zinc-600">
								avg score: {stats.average_score}/10
							</span>
						</div>
					)}
				</section>

				<section>
					<Suspense fallback={<LeaderboardSkeleton />}>
						<LeaderboardClient items={items} />
					</Suspense>
				</section>
			</div>
		</main>
	);
}
