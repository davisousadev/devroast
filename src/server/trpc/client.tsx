'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import {
	createTRPCContext,
	createTRPCOptionsProxy,
} from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient | undefined;
let browserTRPCClient:
	| ReturnType<typeof createTRPCClient<AppRouter>>
	| undefined;

function getQueryClient() {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

function getTRPCClient() {
	if (typeof window === 'undefined') {
		return createTRPCClient<AppRouter>({
			links: [httpBatchLink({ url: 'http://localhost:3000/api/trpc' })],
		});
	}
	if (!browserTRPCClient)
		browserTRPCClient = createTRPCClient<AppRouter>({
			links: [httpBatchLink({ url: '/api/trpc' })],
		});
	return browserTRPCClient;
}

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: getTRPCClient(),
	queryClient: getQueryClient,
});

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() => getTRPCClient());

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}
