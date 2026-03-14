import { forwardRef, type HTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Toggle } from '../ui/toggle';

const ActionsBar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex w-195 items-center justify-between', className)}
				{...props}
			>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2.5">
						<Toggle label="roast mode" />
					</div>
					<span className="font-mono text-xs text-gray-600">
						{'// maximum sarcasm enabled'}
					</span>
				</div>
				<Button>$ roast_my_code</Button>
			</div>
		);
	}
);

ActionsBar.displayName = 'ActionsBar';

export { ActionsBar };
