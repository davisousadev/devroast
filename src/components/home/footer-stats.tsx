import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const FooterStats = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex items-center justify-center gap-6', className)}
				{...props}
			>
				<span className="font-mono text-xs text-gray-600">
					2,847 codes roasted
				</span>
				<span className="font-mono text-xs text-gray-600">·</span>
				<span className="font-mono text-xs text-gray-600">
					avg score: 4.2/10
				</span>
			</div>
		);
	}
);

FooterStats.displayName = 'FooterStats';

export { FooterStats };
