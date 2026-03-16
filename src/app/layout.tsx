import type { Metadata } from 'next';
import { Navbar, NavbarLogo } from '@/components/ui/navbar';
import './globals.css';

export const metadata: Metadata = {
	title: 'DevRoast',
	description: 'Paste your code. Get roasted.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-zinc-950">
				<Navbar
					links={[{ label: 'leaderboard', href: '/leaderboard' }]}
					logo={<NavbarLogo name="devroast" href="/" />}
				/>
				{children}
			</body>
		</html>
	);
}
