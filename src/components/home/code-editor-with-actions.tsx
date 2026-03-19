'use client';

import { useState } from 'react';
import { CodeEditor } from '@/components/code-editor';
import { ActionsBarClient } from './actions-bar-client';

export function CodeEditorWithActions() {
	const [code, setCode] = useState('');
	const [language, setLanguage] = useState('javascript');

	return (
		<div className="flex w-full max-w-4xl flex-col items-center gap-8">
			<CodeEditor
				showLanguageSelector
				editable
				language={language}
				onLanguageChange={setLanguage}
				onCodeChange={setCode}
			/>
			<ActionsBarClient code={code} language={language} />
		</div>
	);
}
