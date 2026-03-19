'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useTRPC } from '@/server/trpc/client';

interface ActionsBarClientProps {
	code: string;
	language: string;
}

export function ActionsBarClient({ code, language }: ActionsBarClientProps) {
	const router = useRouter();
	const trpc = useTRPC();
	const [roastMode, setRoastMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const createRoastMutation = useMutation(trpc.roast.create.mutationOptions());

	const handleSubmit = async () => {
		if (!code.trim()) return;

		setIsLoading(true);
		setErrorMessage(null);
		try {
			const result = await createRoastMutation.mutateAsync({
				code,
				language,
				roastMode,
			});

			router.push(`/roast/${result.id}`);
		} catch (error: unknown) {
			console.error('Roast failed:', error);

			let message = 'Roast failed. Please try again.';

			if (error && typeof error === 'object') {
				const err = error as { message?: string; code?: string };
				const errMsg = err.message || '';

				if (
					errMsg.includes('429') ||
					errMsg.includes('quota') ||
					errMsg.includes('RESOURCE_EXHAUSTED')
				) {
					message = 'API quota exceeded. Please try again in a few minutes.';
				} else if (errMsg.includes('401') || errMsg.includes('API key')) {
					message = 'Invalid API key. Please check your configuration.';
				} else if (
					errMsg.includes('400') ||
					errMsg.includes('INVALID_ARGUMENT')
				) {
					message = 'Invalid request. Please check your code.';
				}
			}

			setErrorMessage(message);
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-195 flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2.5">
						<Toggle
							label="roast mode"
							pressed={roastMode}
							onPressedChange={setRoastMode}
						/>
					</div>
					<span className="font-mono text-xs text-gray-600">
						{roastMode
							? '// maximum sarcasm enabled'
							: '// constructive feedback mode'}
					</span>
				</div>
				<Button onClick={handleSubmit} disabled={isLoading || !code.trim()}>
					{isLoading ? (
						<span className="animate-pulse">roasting...</span>
					) : (
						'$ roast_my_code'
					)}
				</Button>
			</div>

			{errorMessage && (
				<div className="flex items-center justify-center rounded border border-red-500/50 bg-red-500/10 px-4 py-2">
					<span className="font-mono text-sm text-red-400">{errorMessage}</span>
				</div>
			)}
		</div>
	);
}
