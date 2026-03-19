'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/ui/code-block';
import { useTRPC } from '@/server/trpc/client';
import type { ParsedIssue } from '@/services/roast/parser';
import { RoastIssues } from './roast-issues';
import { RoastLoading } from './roast-loading';
import { RoastScore } from './roast-score';
import { RoastSummary } from './roast-summary';

interface RoastResultData {
	id: string;
	submissionId: string;
	roastMode: boolean;
	summary: string;
	score: number;
	code: string;
	language: string;
	username: string;
	issues: ParsedIssue[];
	createdAt: Date;
}

interface RoastContainerProps {
	resultId: string;
	initialData?: RoastResultData;
}

export function RoastContainer({ resultId, initialData }: RoastContainerProps) {
	const trpc = useTRPC();

	const { data, isLoading } = useQuery({
		...trpc.roast.getById.queryOptions({ id: resultId }),
		initialData: initialData as
			| Awaited<ReturnType<typeof trpc.roast.getById.query>>
			| undefined,
		staleTime: Infinity,
	});

	if (isLoading && !data) {
		return <RoastLoading />;
	}

	if (!data) {
		return (
			<div className="flex flex-col items-center gap-4 py-12">
				<span className="font-mono text-lg text-red-500">Roast not found</span>
			</div>
		);
	}

	const roastData = data as unknown as RoastResultData;

	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="font-mono text-2xl text-emerald-500">&gt;</span>
					<h1 className="font-mono text-2xl font-bold text-zinc-100">
						{roastData.roastMode ? 'Roast Results' : 'Code Review'}
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="warning" showDot={false}>
						{roastData.roastMode ? 'Roast Mode 🔥' : 'Normal Mode 📝'}
					</Badge>
				</div>
			</div>

			<RoastScore score={roastData.score} roastMode={roastData.roastMode} />

			<RoastSummary
				summary={roastData.summary}
				roastMode={roastData.roastMode}
			/>

			<div className="flex flex-col gap-3">
				<h2 className="flex items-center gap-2 font-mono text-sm font-bold text-zinc-200">
					<span className="text-emerald-500">{'//'}</span>
					<span>Submitted Code</span>
				</h2>
				<CodeBlock
					code={roastData.code}
					lang={roastData.language}
					showLineNumbers
				/>
			</div>

			<div className="flex flex-col gap-3">
				<h2 className="flex items-center gap-2 font-mono text-sm font-bold text-zinc-200">
					<span className="text-emerald-500">{'//'}</span>
					<span>Issues Found ({roastData.issues.length})</span>
				</h2>
				<RoastIssues issues={roastData.issues} />
			</div>

			<div className="flex items-center justify-between border-t border-zinc-800 pt-4">
				<span className="font-mono text-xs text-zinc-500">
					@{roastData.username}
				</span>
				<span className="font-mono text-xs text-zinc-500">
					{new Date(roastData.createdAt).toLocaleDateString()}
				</span>
			</div>
		</div>
	);
}
