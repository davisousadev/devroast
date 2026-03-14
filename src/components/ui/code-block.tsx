import { forwardRef, type HTMLAttributes } from 'react';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/utils';

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
	code: string;
	lang?: string;
	showLineNumbers?: boolean;
	showHeader?: boolean;
	fileName?: string;
}

async function highlightCode(
	code: string,
	lang: string = 'javascript'
): Promise<string> {
	const html = await codeToHtml(code, {
		lang,
		theme: 'vesper',
	});
	return html;
}

const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
	(
		{
			className,
			code,
			lang = 'javascript',
			showLineNumbers = true,
			showHeader = true,
			fileName,
			...props
		},
		ref
	) => {
		const lines = code.split('\n');

		return (
			<div
				ref={ref}
				className={cn(
					'w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-900',
					className
				)}
				{...props}
			>
				{showHeader && (
					<div className="flex h-10 items-center gap-3 border-b border-zinc-800 px-4">
						<span className="h-2.5 w-2.5 rounded-full bg-red-500" />
						<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
						<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
						<div className="flex-1" />
						{fileName && (
							<span className="font-mono text-xs text-gray-600">
								{fileName}
							</span>
						)}
					</div>
				)}
				<div className="flex">
					{showLineNumbers && (
						<div className="flex flex-col gap-1 border-r border-zinc-800 bg-zinc-950 py-3 pl-3 pr-2">
							{lines.map((_, i) => (
								<span
									key={i}
									className="font-mono text-[13px] leading-[1.5rem] text-gray-600"
								>
									{i + 1}
								</span>
							))}
						</div>
					)}
					<div className="flex-1 overflow-x-auto p-3">
						<CodeHighlight code={code} lang={lang} />
					</div>
				</div>
			</div>
		);
	}
);

CodeBlock.displayName = 'CodeBlock';

async function CodeHighlight({ code, lang }: { code: string; lang: string }) {
	const html = await highlightCode(code, lang);

	return (
		<div
			className="shiki-container font-mono text-[13px] leading-[1.5rem]"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

export { CodeBlock };
