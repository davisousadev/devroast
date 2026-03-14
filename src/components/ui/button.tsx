import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const buttonVariants = tv({
	base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-mono',
	variants: {
		variant: {
			default:
				'bg-emerald-500 text-zinc-950 hover:bg-emerald-500/90 focus-visible:ring-emerald-500',
			destructive:
				'bg-red-500 text-zinc-50 hover:bg-red-500/90 focus-visible:ring-red-500',
			outline:
				'border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-500',
			secondary:
				'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 focus-visible:ring-zinc-500',
			ghost:
				'hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-500',
			link: 'text-zinc-900 underline-offset-4 hover:underline focus-visible:ring-zinc-500',
		},
		size: {
			default: 'h-auto px-6 py-[10px] text-[13px]',
			sm: 'h-9 rounded-md px-3 text-[13px]',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = 'Button';

export { Button, buttonVariants };
