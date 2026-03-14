import { forwardRef, type HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const diffLineVariants = tv({
	base: 'flex w-full gap-2 px-4 py-2 font-mono text-[13px]',
	variants: {
		type: {
			removed: 'bg-red-950/50 text-gray-500',
			added: 'bg-emerald-950/50 text-zinc-200',
			context: 'text-gray-600',
		},
	},
	defaultVariants: {
		type: 'context',
	},
});

const diffPrefixVariants = tv({
	base: 'w-4 shrink-0 font-mono',
	variants: {
		type: {
			removed: 'text-red-500',
			added: 'text-emerald-500',
			context: 'text-gray-600',
		},
	},
	defaultVariants: {
		type: 'context',
	},
});

export interface DiffLineProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineVariants> {
	prefix?: '+' | '-' | ' ';
	code: string;
}

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
	({ className, type, prefix = ' ', code, ...props }, ref) => {
		const getPrefix = () => {
			if (prefix === '+') return '+';
			if (prefix === '-') return '-';
			return ' ';
		};

		return (
			<div
				ref={ref}
				className={cn(diffLineVariants({ type, className }))}
				{...props}
			>
				<span className={cn(diffPrefixVariants({ type }))}>{getPrefix()}</span>
				<span className="flex-1">{code}</span>
			</div>
		);
	}
);

DiffLine.displayName = 'DiffLine';

export { DiffLine, diffLineVariants, diffPrefixVariants };
