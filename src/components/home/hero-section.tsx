import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const HeroSection = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex flex-col items-center gap-3', className)}
				{...props}
			>
				<h1 className="flex items-center gap-3 font-mono text-4xl font-bold text-zinc-200">
					<span className="text-emerald-500">$</span>
					<span>paste your code. get roasted.</span>
				</h1>
				<p className="font-mono text-sm text-gray-500">
					{`// drop your code below and we'll rate it — brutally honest or full roast mode`}
				</p>
			</div>
		);
	}
);

HeroSection.displayName = 'HeroSection';

export { HeroSection };
