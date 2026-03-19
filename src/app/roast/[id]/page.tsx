import { RoastContainer } from '@/components/roast/roast-container';
import { caller } from '@/server/trpc/server';

export const metadata = {
	title: 'Roast Result | DevRoast',
	description: 'See how your code was roasted.',
};

interface RoastPageProps {
	params: Promise<{ id: string }>;
}

export default async function RoastPage({ params }: RoastPageProps) {
	const { id } = await params;

	let initialData: unknown = null;
	try {
		initialData = await caller.roast.getById({ id });
	} catch {
		initialData = null;
	}

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col px-10 pb-20 pt-16">
			<div className="mx-auto flex w-full max-w-4xl flex-col">
				<RoastContainer
					resultId={id}
					initialData={
						initialData as Parameters<typeof RoastContainer>[0]['initialData']
					}
				/>
			</div>
		</main>
	);
}
