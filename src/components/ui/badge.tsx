import { forwardRef, type HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const badgeVariants = tv({
	base: 'inline-flex items-center gap-2 font-mono text-xs',
	variants: {
		variant: {
			critical: 'text-red-500',
			warning: 'text-amber-500',
			good: 'text-emerald-500',
			verdict: 'text-red-500',
		},
		size: {
			default: 'text-xs',
			sm: 'text-[10px]',
			lg: 'text-sm',
		},
	},
	defaultVariants: {
		variant: 'critical',
		size: 'default',
	},
});

const badgeDotVariants = tv({
	base: 'rounded-full',
	variants: {
		variant: {
			critical: 'bg-red-500',
			warning: 'bg-amber-500',
			good: 'bg-emerald-500',
			verdict: 'bg-red-500',
		},
		size: {
			default: 'h-2 w-2',
			sm: 'h-1.5 w-1.5',
			lg: 'h-2.5 w-2.5',
		},
	},
	defaultVariants: {
		variant: 'critical',
		size: 'default',
	},
});

export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	showDot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant, size, showDot = true, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(badgeVariants({ variant, size, className }))}
				{...props}
			>
				{showDot && <span className={badgeDotVariants({ variant, size })} />}
				{children}
			</div>
		);
	}
);

Badge.displayName = 'Badge';

export { Badge, badgeDotVariants, badgeVariants };
