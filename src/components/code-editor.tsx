import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
	code?: string;
	showLineNumbers?: boolean;
	fileName?: string;
}

const defaultCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
	(
		{
			className,
			code = defaultCode,
			showLineNumbers = true,
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
					'w-195 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900',
					className
				)}
				{...props}
			>
				<div className="flex h-10 items-center justify-between border-b border-zinc-800 px-4">
					<div className="flex items-center gap-2">
						<span className="h-3 w-3 rounded-full bg-red-500" />
						<span className="h-3 w-3 rounded-full bg-amber-500" />
						<span className="h-3 w-3 rounded-full bg-emerald-500" />
					</div>
					{fileName && (
						<span className="font-mono text-xs text-gray-600">{fileName}</span>
					)}
					<div className="w-13" />
				</div>
				<div className="flex h-80">
					{showLineNumbers && (
						<div className="flex flex-col gap-2 border-r border-zinc-800 bg-zinc-950 py-4 pl-3 pr-2">
							{lines.map((_, i) => (
								<span
									key={i}
									className="block w-6.5 text-right font-mono text-xs leading-6 text-gray-600"
								>
									{i + 1}
								</span>
							))}
						</div>
					)}
					<div className="flex-1 overflow-auto p-4">
						<SyntaxHighlightedCode code={code} />
					</div>
				</div>
			</div>
		);
	}
);

CodeEditor.displayName = 'CodeEditor';

function SyntaxHighlightedCode({ code }: { code: string }) {
	const lines = code.split('\n');

	return (
		<pre className="font-mono text-xs leading-6">
			{lines.map((line, i) => (
				<CodeLine key={i} line={line} />
			))}
		</pre>
	);
}

function CodeLine({ line }: { line: string }) {
	const tokens = tokenize(line);
	return (
		<div>
			{tokens.map((token, i) => (
				<span key={i} style={{ color: token.color }}>
					{token.text}
				</span>
			))}
		</div>
	);
}

interface Token {
	text: string;
	color: string;
}

function tokenize(line: string): Token[] {
	const tokens: Token[] = [];

	const patterns: { regex: RegExp; color: string }[] = [
		{
			regex: /^(function|var|const|let|if|else|for|return|true|false)\b/,
			color: '#C678DD',
		},
		{ regex: /^(console|log)\b/, color: '#E06C75' },
		{ regex: /\b(\d+\.?\d*)\b/, color: '#D19A66' },
		{ regex: /("(?:[^"\\]|\\.)*")/, color: '#E5C07B' },
		{ regex: /(\/\/.*)$/, color: '#8B8B8B' },
		{
			regex: /\b(items|total|i|price|discount|calculateTotal)\b/,
			color: '#E06C75',
		},
		{ regex: /(===|==|!==|!=|>=|<=|<|>)/, color: '#ABB2BF' },
		{ regex: /(\.length|\.price)/, color: '#98C379' },
		{ regex: /([{}()[\];])/, color: '#ABB2BF' },
		{ regex: /(\+\+)/, color: '#ABB2BF' },
	];

	let remaining = line;

	while (remaining.length > 0) {
		let matched = false;

		for (const { regex, color } of patterns) {
			const match = remaining.match(regex);
			if (match && match.index === 0) {
				tokens.push({ text: match[0], color });
				remaining = remaining.slice(match[0].length);
				matched = true;
				break;
			}
		}

		if (!matched) {
			tokens.push({ text: remaining[0], color: '#E5E5E5' });
			remaining = remaining.slice(1);
		}
	}

	if (tokens.length === 0) {
		tokens.push({ text: ' ', color: '#E5E5E5' });
	}

	return tokens;
}

export { CodeEditor };
