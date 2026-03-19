'use client';

import { ScoreRing } from '@/components/ui/score-ring';
import { getScoreLabel } from '@/services/roast/scorer';

interface RoastScoreProps {
	score: number;
	roastMode: boolean;
}

export function RoastScore({ score, roastMode }: RoastScoreProps) {
	const label = getScoreLabel(score, roastMode);

	return (
		<div className="flex flex-col items-center gap-4">
			<ScoreRing score={score} maxScore={100} size={200} strokeWidth={6} />
			<div className="flex flex-col items-center gap-1 text-center">
				<span
					className={`font-mono text-2xl font-bold ${
						score < 30
							? 'text-red-500'
							: score < 60
								? 'text-yellow-500'
								: 'text-emerald-500'
					}`}
				>
					{score}/100
				</span>
				<span className="font-mono text-sm text-zinc-400">{label}</span>
			</div>
		</div>
	);
}
