'use client';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const toggleVariants = tv({
	base: 'inline-flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: '',
			outline: '',
		},
		size: {
			default: '',
			sm: '',
			lg: '',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

const toggleTrackVariants = tv({
	base: 'relative h-6 w-10 rounded-full px-0.75 transition-colors',
	variants: {
		pressed: {
			true: 'bg-emerald-500',
			false: 'bg-zinc-800',
		},
	},
});

const toggleKnobVariants = tv({
	base: 'block h-4 w-4 rounded-full transition-transform',
	variants: {
		pressed: {
			true: 'translate-x-4.5 bg-zinc-950',
			false: 'translate-x-0 bg-gray-500',
		},
	},
});

export interface ToggleProps
	extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
		VariantProps<typeof toggleVariants> {
	label?: string;
}

const Toggle = React.forwardRef<
	React.ComponentRef<typeof TogglePrimitive.Root>,
	ToggleProps
>(({ className, variant, size, label, pressed, defaultPressed, onPressedChange, ...props }, ref) => {
	const [internalPressed, setInternalPressed] = React.useState(
		defaultPressed ?? false
	);
	const isControlled = pressed !== undefined;
	const currentPressed = isControlled ? pressed : internalPressed;

	const handlePressedChange = (nextPressed: boolean) => {
		if (!isControlled) {
			setInternalPressed(nextPressed);
		}

		onPressedChange?.(nextPressed);
	};

	return (
		<div className={cn(toggleVariants({ variant, size, className }))}>
			<TogglePrimitive.Root
				ref={ref}
				pressed={currentPressed}
				onPressedChange={handlePressedChange}
				className={cn(toggleTrackVariants({ pressed: currentPressed }))}
				{...props}
			>
				<span className={cn(toggleKnobVariants({ pressed: currentPressed }))} />
			</TogglePrimitive.Root>
			{label && (
				<span
					className={cn(
						'font-mono text-xs transition-colors',
						currentPressed ? 'text-emerald-500' : 'text-gray-500'
					)}
				>
					{label}
				</span>
			)}
		</div>
	);
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
