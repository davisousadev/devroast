import { forwardRef, type HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const cardVariants = tv({
	base: 'w-full rounded-md border border-zinc-800 bg-transparent p-5',
	variants: {
		variant: {
			default: 'border-zinc-800',
			elevated: 'border-zinc-800 bg-zinc-900',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const cardHeaderVariants = tv({
	base: 'flex items-center gap-2',
});

const cardTitleVariants = tv({
	base: 'font-mono text-[13px] text-zinc-200',
});

const cardDescriptionVariants = tv({
	base: 'font-mono text-[12px] text-gray-500 leading-relaxed',
});

export interface CardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(cardVariants({ variant, className }))}
				{...props}
			/>
		);
	}
);

Card.displayName = 'Card';

const CardHeader = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(cardHeaderVariants({ className }))}
			{...props}
		/>
	);
});

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof cardTitleVariants>
>(({ className, ...props }, ref) => {
	return (
		<p ref={ref} className={cn(cardTitleVariants({ className }))} {...props} />
	);
});

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement> &
		VariantProps<typeof cardDescriptionVariants>
>(({ className, ...props }, ref) => {
	return (
		<p
			ref={ref}
			className={cn(cardDescriptionVariants({ className }))}
			{...props}
		/>
	);
});

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return <div ref={ref} className={cn('mt-3', className)} {...props} />;
	}
);

CardContent.displayName = 'CardContent';

export {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	cardVariants,
};
