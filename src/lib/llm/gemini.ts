import { GoogleGenAI } from '@google/genai';

export interface Message {
	role: 'user' | 'model';
	content: string;
}

export interface ChatOptions {
	messages: Message[];
	model?: string;
}

export class GeminiQuotaError extends Error {
	retryAfter?: number;
	needsBilling?: boolean;

	constructor(message: string, retryAfter?: number, needsBilling = false) {
		super(message);
		this.name = 'GeminiQuotaError';
		this.retryAfter = retryAfter;
		this.needsBilling = needsBilling;
	}
}

function extractGeminiErrorText(error: unknown): string {
	if (!(error && typeof error === 'object')) return '';

	const err = error as {
		message?: unknown;
		error?: { message?: unknown };
	};

	const directMessage =
		typeof err.message === 'string' ? err.message : JSON.stringify(err.message);
	const nestedMessage =
		typeof err.error?.message === 'string'
			? err.error.message
			: JSON.stringify(err.error?.message);

	return [directMessage, nestedMessage].filter(Boolean).join(' ').toLowerCase();
}

export async function geminiChat({
	messages,
	model = 'gemini-2.5-flash',
}: ChatOptions): Promise<string> {
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error('GEMINI_API_KEY is not configured');
	}

	const ai = new GoogleGenAI({ apiKey });

	const contents = messages.map((msg) => ({
		role: msg.role === 'model' ? 'model' : 'user',
		parts: [{ text: msg.content }],
	}));

	try {
		const response = await ai.models.generateContent({
			model,
			contents,
			config: {
				temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.7,
				maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS) || 4000,
			},
		});

		const text = response.text;

		if (!text) {
			throw new Error('Gemini returned empty response');
		}

		return text;
	} catch (error: unknown) {
		if (error && typeof error === 'object' && 'status' in error) {
			const err = error as { status: number; message?: string };
			if (err.status === 429) {
				const fullErrorText = extractGeminiErrorText(error);
				const retryMatch = String(err.message || '').match(
					/retry in ([\d.]+)s/
				);
				const retryAfter = retryMatch ? parseFloat(retryMatch[1]) : undefined;
				const hasNoQuotaConfigured =
					fullErrorText.includes('limit: 0') ||
					fullErrorText.includes('check your plan and billing details');

				if (hasNoQuotaConfigured) {
					throw new GeminiQuotaError(
						'Gemini API sem quota ativa para este projeto/chave (limit: 0). Ative billing/quotas no Google AI Studio e gere uma nova chave.',
						retryAfter,
						true
					);
				}

				throw new GeminiQuotaError(
					'API quota exceeded. Please try again in a few minutes.',
					retryAfter
				);
			}
		}
		throw error;
	}
}
