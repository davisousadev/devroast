'use client';

import { forwardRef, type HTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
	score: number;
	maxScore?: number;
	size?: number;
	strokeWidth?: number;
	children?: ReactNode;
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
	(
		{
			className,
			score,
			maxScore = 10,
			size = 180,
			strokeWidth = 4,
			children,
			...props
		},
		ref
	) => {
		const radius = (size - strokeWidth) / 2;
		const circumference = radius * 2 * Math.PI;
		const percentage = Math.min(Math.max(score / maxScore, 0), 1);
		const strokeDashoffset = circumference - percentage * circumference;

		const gradientId = useId();

		return (
			<div
				ref={ref}
				className={cn(
					'relative inline-flex items-center justify-center',
					className
				)}
				style={{ width: size, height: size }}
				{...props}
			>
				<svg width={size} height={size} className="absolute inset-0 -rotate-90">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="#27272a"
						strokeWidth={strokeWidth}
					/>
					<defs>
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#10b981" />
							<stop offset="35%" stopColor="#f59e0b" />
							<stop offset="36%" stopColor="transparent" />
						</linearGradient>
					</defs>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={`url(#${gradientId})`}
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						className="transition-all duration-500"
					/>
				</svg>
				{children && (
					<div className="absolute inset-0 flex items-center justify-center">
						{children}
					</div>
				)}
			</div>
		);
	}
);

ScoreRing.displayName = 'ScoreRing';

export { ScoreRing };
