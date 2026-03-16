import hljs from 'highlight.js';

export function detectLanguage(code: string): string {
	if (!code || code.trim().length === 0) {
		return 'plaintext';
	}

	const result = hljs.highlightAuto(code);
	return result.language || 'plaintext';
}

export const SUPPORTED_LANGUAGES = [
	{ value: 'javascript', label: 'JavaScript' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'python', label: 'Python' },
	{ value: 'rust', label: 'Rust' },
	{ value: 'go', label: 'Go' },
	{ value: 'java', label: 'Java' },
	{ value: 'cpp', label: 'C++' },
	{ value: 'c', label: 'C' },
	{ value: 'csharp', label: 'C#' },
	{ value: 'php', label: 'PHP' },
	{ value: 'ruby', label: 'Ruby' },
	{ value: 'swift', label: 'Swift' },
	{ value: 'kotlin', label: 'Kotlin' },
	{ value: 'html', label: 'HTML' },
	{ value: 'css', label: 'CSS' },
	{ value: 'scss', label: 'SCSS' },
	{ value: 'json', label: 'JSON' },
	{ value: 'yaml', label: 'YAML' },
	{ value: 'sql', label: 'SQL' },
	{ value: 'bash', label: 'Bash' },
	{ value: 'shell', label: 'Shell' },
	{ value: 'markdown', label: 'Markdown' },
	{ value: 'xml', label: 'XML' },
	{ value: 'plaintext', label: 'Plain Text' },
];
