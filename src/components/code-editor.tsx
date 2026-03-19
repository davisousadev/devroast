'use client';

import hljs from 'highlight.js';
import { forwardRef, type HTMLAttributes, useMemo, useState } from 'react';
import {
	detectLanguage,
	SUPPORTED_LANGUAGES,
} from '@/lib/code-editor/languageDetect';
import { cn } from '@/lib/utils';

export interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
	code?: string;
	showLineNumbers?: boolean;
	fileName?: string;
	language?: string;
	onLanguageChange?: (language: string) => void;
	showLanguageSelector?: boolean;
	editable?: boolean;
	onCodeChange?: (code: string) => void;
}

const defaultCode = `copy your code here and get roasted









`;

const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
	(
		{
			className,
			code = defaultCode,
			showLineNumbers = true,
			fileName,
			language: initialLanguage,
			onLanguageChange,
			showLanguageSelector = false,
			editable = false,
			onCodeChange,
			...props
		},
		ref
	) => {
		const [manualLanguage, setManualLanguage] = useState<string | null>(null);
		const [internalCode, setInternalCode] = useState(code);

		const effectiveCode = editable ? internalCode : code;

		const handleCodeChange = (newCode: string) => {
			setInternalCode(newCode);
			onCodeChange?.(newCode);
		};

		const detectedLanguage = useMemo(() => {
			if (manualLanguage) return manualLanguage;
			if (initialLanguage) return initialLanguage;
			return detectLanguage(effectiveCode);
		}, [effectiveCode, initialLanguage, manualLanguage]);

		const highlightedCode = useMemo(() => {
			if (detectedLanguage && detectedLanguage !== 'plaintext') {
				try {
					const result = hljs.highlight(effectiveCode, { language: detectedLanguage });
					return result.value;
				} catch {
					return hljs.highlightAuto(effectiveCode).value;
				}
			}
			return hljs.highlightAuto(effectiveCode).value;
		}, [effectiveCode, detectedLanguage]);

		const lines = highlightedCode.split('\n');

		const handleLanguageChange = (newLanguage: string) => {
			setManualLanguage(newLanguage);
			onLanguageChange?.(newLanguage);
		};

		return (
			<div
				ref={ref}
				className={cn(
					'relative w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-900',
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

					{showLanguageSelector && (
						<select
							value={manualLanguage || detectedLanguage}
							onChange={(e) => handleLanguageChange(e.target.value)}
							className="bg-zinc-800 px-2 py-1 pr-6 text-xs text-gray-300 outline-none"
						>
							{SUPPORTED_LANGUAGES.map((lang) => (
								<option key={lang.value} value={lang.value}>
									{lang.label}
								</option>
							))}
						</select>
					)}

					{fileName && !showLanguageSelector && (
						<span className="font-mono text-xs text-gray-600">{fileName}</span>
					)}

					<div className="w-13" />
				</div>
				<div className="flex max-h-80">
					{showLineNumbers && (
						<div className="flex flex-none flex-col border-r border-zinc-800 bg-zinc-950 py-4 pl-3 pr-2">
							{lines.map((_, i) => (
								<span
									key={i}
									className="block w-6 text-right font-mono text-xs leading-6 text-gray-600"
								>
									{i + 1}
								</span>
							))}
						</div>
					)}
					<div className="grid flex-1 overflow-auto p-4">
						{editable && (
							<textarea
								value={internalCode}
								onChange={(e) => handleCodeChange(e.target.value)}
								style={{ gridArea: '1 / 1', caretColor: 'white', color: 'transparent' }}
								className="font-mono text-xs leading-6 bg-transparent resize-none outline-none border-none whitespace-pre"
								spellCheck={false}
								autoComplete="off"
								autoCorrect="off"
								autoCapitalize="off"
							/>
						)}
						<pre
							aria-hidden={editable}
							style={editable ? { gridArea: '1 / 1', pointerEvents: 'none', userSelect: 'none' } : undefined}
							className="font-mono text-xs leading-6"
						>
							<code
								dangerouslySetInnerHTML={{ __html: highlightedCode }}
								className="hljs"
							/>
						</pre>
					</div>
				</div>
			</div>
		);
	}
);

CodeEditor.displayName = 'CodeEditor';

export { CodeEditor };
