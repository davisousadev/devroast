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

	constructor(message: string, retryAfter?: number) {
		super(message);
		this.name = 'GeminiQuotaError';
		this.retryAfter = retryAfter;
	}
}

export async function geminiChat({
	messages,
	model = 'gemini-2.0-flash',
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
				const retryMatch = String(err.message || '').match(
					/retry in ([\d.]+)s/
				);
				const retryAfter = retryMatch ? parseFloat(retryMatch[1]) : undefined;
				throw new GeminiQuotaError(
					'API quota exceeded. Please try again in a few minutes.',
					retryAfter
				);
			}
		}
		throw error;
	}
}
