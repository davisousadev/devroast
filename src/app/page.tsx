import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CodeEditor } from '@/components/code-editor';
import { ActionsBar } from '@/components/home/actions-bar';
import { FooterStats } from '@/components/home/footer-stats';
import { HeroSection } from '@/components/home/hero-section';
import { LeaderboardPreview } from '@/components/home/leaderboard-preview';
import { getQueryClient, trpc } from '@/server/trpc/server';

export default async function Home() {
	const queryClient = getQueryClient();
	await Promise.all([
		queryClient.prefetchQuery(trpc.stats.get.queryOptions()),
		queryClient.prefetchQuery(
			trpc.leaderboard.getTopWorst.queryOptions({ limit: 3 })
		),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="flex min-h-[calc(100vh-14rem)] w-full flex-col items-center px-10 pt-20">
				<div className="flex flex-col items-center gap-8">
					<HeroSection />
					<CodeEditor showLanguageSelector editable />
					<ActionsBar />
					<div className="h-15 w-full" />
					<LeaderboardPreview />
					<div className="h-15 w-full" />
				</div>
				<FooterStats />
			</main>
		</HydrationBoundary>
	);
}
