import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
	logo?: ReactNode;
	links?: { label: string; href: string; active?: boolean }[];
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
	({ className, logo, links = [], ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'flex h-14 w-full items-center justify-between border-b border-zinc-900 bg-zinc-950 px-10',
					className
				)}
				{...props}
			>
				{logo && <div className="flex items-center gap-2">{logo}</div>}
				<div className="flex-1" />
				<nav className="flex items-center gap-6">
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className={cn(
								'font-mono text-[13px] transition-colors',
								link.active
									? 'text-zinc-200'
									: 'text-zinc-400 hover:text-zinc-200'
							)}
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		);
	}
);

Navbar.displayName = 'Navbar';

export interface NavbarLogoProps extends HTMLAttributes<HTMLDivElement> {
	prompt?: string;
	name: string;
	href?: string;
}

const NavbarLogo = forwardRef<HTMLDivElement, NavbarLogoProps>(
	({ className, prompt = '>', name, href, ...props }, ref) => {
		const content = (
			<>
				<span className="font-mono text-xl font-bold text-emerald-500">
					{prompt}
				</span>
				<span className="font-mono text-lg font-medium text-zinc-200">
					{name}
				</span>
			</>
		);

		return (
			<div
				ref={ref}
				className={cn('flex items-center gap-2', className)}
				{...props}
			>
				{href ? (
					<a href={href} className="flex items-center gap-2">
						{content}
					</a>
				) : (
					content
				)}
			</div>
		);
	}
);

NavbarLogo.displayName = 'NavbarLogo';

export { Navbar, NavbarLogo };
