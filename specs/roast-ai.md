# Especificação AI Roast - DevRoast

## Visão Geral

Sistema de análise de código por IA que permite aos usuários enviar trechos de código e receber feedback detalhado sobre problemas, melhorias e (opcionalmente) roasts sarcásticos. O usuário pode escolher entre dois modos de análise.

## Stack

- **LLM**: Google Gemini 2.0 Flash
- **Framework**: Next.js 16 (App Router)
- **ORM**: Drizzle ORM
- **API**: tRPC v11
- **Validação**: Zod
- **Resposta**: Completa (sem streaming)

## Estrutura de Arquivos

```
src/
├── app/
│   └── roast/
│       └── page.tsx                    # Página de resultado do roast
├── components/
│   ├── roast/
│   │   ├── roast-container.tsx        # Container principal (client)
│   │   ├── roast-summary.tsx          # Resumo do roast
│   │   ├── roast-issues.tsx           # Lista de issues encontrados
│   │   ├── roast-issue-item.tsx       # Issue individual
│   │   ├── roast-loading.tsx          # Loading state
│   │   └── roast-score.tsx           # Score visual
│   └── ui/
│       └── ...
├── server/
│   └── trpc/
│       └── routers/
│           └── roast.ts               # Router de roast
├── services/
│   └── roast/
│       ├── index.ts                   # Orquestrador principal
│       ├── prompts.ts                 # System prompts (normal + roast)
│       ├── parser.ts                  # Parser de resposta do LLM
│       └── scorer.ts                  # Cálculo de score
└── lib/
    └── llm/
        └── gemini.ts                  # Cliente Gemini
```

## Modelo de Dados

### RoastResult (schema.ts)

```typescript
export const roastResults = pgTable('roast_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .references(() => submissions.id)
    .notNull(),
  roastMode: boolean('roast_mode').notNull(), // true = sarcastic, false = normal
  summary: text('summary').notNull(),
  score: integer('score').notNull(), // 0-100 (lower = worse)
  rawResponse: text('raw_response'), // JSON original da IA
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const roastIssues = pgTable('roast_issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  roastResultId: uuid('roast_result_id')
    .references(() => roastResults.id)
    .notNull(),
  type: roastIssueType('type').notNull(), // 'critical' | 'warning' | 'good'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  line: integer('line'),
  suggestion: text('suggestion'), // Como melhorar
  severity: integer('severity').notNull(), // 1-10
});
```

## Prompts do Sistema

### 1. Prompt Normal (Educado)

```markdown
You are a senior software engineer conducting a constructive code review. Your goal is to help developers improve their code through actionable, respectful feedback.

Analyze the provided code and identify:
1. **Critical Issues** (must fix): Security vulnerabilities, bugs, performance problems
2. **Warnings** (should fix): Code smells, anti-patterns, missing best practices
3. **Good Points** (keep doing this): Well-written sections worth praising

For each issue found, provide:
- A clear title describing the problem
- Explanation of why it's problematic
- A specific, actionable suggestion to fix it
- The approximate line number (if identifiable)

Also provide:
- An overall summary (2-3 sentences)
- A score from 0-100 (100 = perfect code)

Be specific, constructive, and educational. Focus on teaching, not criticizing.
```

### 2. Prompt Roast (Sarcástico)

```markdown
You are Sarcasmotron — a senior developer who has seen too much bad code and has NO patience left. You're like Gordon Ramsay meets your most frustrated tech lead.

RULES:
- Be BRUTALLY honest but CORRECT
- Use sarcasm, analogies, and humor to make points memorable
- Compare their code to real-world disasters when fitting
- Don't be cruel for no reason — every roast should teach something
- Find REAL issues, not nitpicks
- End with a score and memorable summary
- IMPORTANT: Always respond with valid JSON only, no markdown code blocks

FORMAT your response EXACTLY as JSON (no markdown, no explanations, just the JSON):

{"summary": "2-3 sentence savage summary of the code", "score": number (0-100, lower = worse), "issues": [{"type": "critical|warning|good", "title": "Catchy, sarcastic title", "description": "Detailed explanation with humor", "line": number or null, "suggestion": "How to fix it (with attitude)"}]}

Look for:
- Security vulnerabilities (SQL injection, XSS, etc.)
- Logic errors and bugs
- Performance anti-patterns
- Naming nightmares
- Comment crimes
- Over-engineering or under-engineering
- Code that's just... beautiful (rare but worth noting)

Make it memorable. Make it hurt. Make them learn.
```

## API tRPC

### Router (server/trpc/routers/roast.ts)

```typescript
export const roastRouter = createTRPCRouter({
  // Mutation: Cria roast e retorna resultado completo
  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.string(),
        roastMode: z.boolean(),
        username: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Criar submission no banco
      const submission = await createSubmission({
        code: input.code,
        language: input.language,
        roastMode: input.roastMode,
        username: input.username || 'anonymous',
      });

      // 2. Chamar LLM e processar resposta
      const result = await processRoast({
        code: input.code,
        language: input.language,
        roastMode: input.roastMode,
        submissionId: submission.id,
      });

      return result;
    }),

  // Query: Buscar resultado por ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return getRoastResult(input.id);
    }),

  // Query: Buscar histórico do usuário
  getByUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return getRoastHistory(input.username);
    }),
});
```

## Fluxo de Execução

### 1. Envio do Código (Client)

```typescript
// components/code-editor.tsx
const handleSubmit = async (code: string, language: string) => {
  const roastMode = toggleRef.current?.checked || false;
  
  const result = await trpc.roast.create.mutate({
    code,
    language,
    roastMode,
  });
  
  // Redirecionar para página de resultado
  router.push(`/roast/${result.id}`);
};
```

### 2. Processamento (Server)

```typescript
// services/roast/index.ts
import { geminiChat } from '@/lib/llm/gemini';

export async function processRoast({
  code,
  language,
  roastMode,
  submissionId,
}: RoastInput): Promise<RoastResult> {
  // 1. Selecionar prompt baseado no modo
  const systemPrompt = roastMode ? PROMPTS.ROAST : PROMPTS.NORMAL;

  // 2. Chamar Gemini
  const response = await geminiChat({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    messages: [
      { role: 'user', content: systemPrompt },
      {
        role: 'user',
        content: `Analyze this ${language} code and respond ONLY with valid JSON:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
  });

  // 3. Parsear resposta JSON
  const parsed = parseLLMResponse(response);

  // 4. Calcular score final
  const finalScore = calculateScore(parsed.issues);

  // 5. Salvar no banco
  const roastResult = await saveRoastResult({
    submissionId,
    roastMode,
    summary: parsed.summary,
    score: finalScore,
    rawResponse: response,
    issues: parsed.issues,
  });

  return roastResult;
}
```

### 3. Cálculo de Score

```typescript
// services/roast/scorer.ts
export function calculateScore(issues: Issue[]): number {
  let score = 100;

  for (const issue of issues) {
    if (issue.type === 'critical') {
      score -= 20; // Cada critical remove 20 pontos
    } else if (issue.type === 'warning') {
      score -= 10; // Cada warning remove 10 pontos
    } else if (issue.type === 'good') {
      score += 5; // Bônus de até 10 pontos por bons pontos
    }
  }

  // Normalizar para 0-100
  return Math.max(0, Math.min(100, score));
}
```

## Componentes UI

### RoastContainer

```typescript
interface RoastContainerProps {
  resultId: string;
  initialData?: RoastResult;
}

export function RoastContainer({ resultId, initialData }: RoastContainerProps) {
  const { data, isLoading } = trpc.roast.getById.useQuery(
    { id: resultId },
    { initialData }
  );

  if (isLoading) return <RoastLoading />;

  return (
    <div className="flex flex-col gap-8">
      <RoastScore score={data.score} mode={data.roastMode} />
      <RoastSummary summary={data.summary} />
      <RoastIssues issues={data.issues} />
    </div>
  );
}
```

### RoastScore

```typescript
// Componente visual de score
// - Anel circular com progresso
// - Cor baseada no score: <30 vermelho, 30-60 amarelo, >60 verde
// - Se roastMode: texto sarcástico ("Parabéns, você alcançou um novo fundo")
// - Se normal: texto encorajador ("Boa tentativa, mas há espaço para melhorar")
```

### RoastIssueItem

```typescript
interface RoastIssueItemProps {
  issue: Issue;
  roastMode: boolean;
}

export function RoastIssueItem({ issue, roastMode }: RoastIssueItemProps) {
  const typeStyles = {
    critical: 'border-red-500 bg-red-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    good: 'border-green-500 bg-green-500/10',
  };

  return (
    <div className={cn('rounded border p-4', typeStyles[issue.type])}>
      <div className="flex items-center gap-2">
        <IssueBadge type={issue.type} />
        <span className="font-mono text-sm font-bold">{issue.title}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{issue.description}</p>
      {issue.suggestion && (
        <div className="mt-2 rounded bg-zinc-800/50 p-2">
          <span className="text-xs text-emerald-500">💡 {issue.suggestion}</span>
        </div>
      )}
    </div>
  );
}
```

## Configuração de LLM

### Variáveis de Ambiente (.env)

```env
# Google Gemini
GEMINI_API_KEY=your-gemini-api-key-here

# Configurações
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=4000
```

### Cliente LLM

```typescript
// lib/llm/gemini.ts
interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatOptions {
  messages: Message[];
  model?: string;
}

export async function geminiChat({
  messages,
  model = 'gemini-2.0-flash',
}: ChatOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: messages.map((msg) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.7,
        maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS) || 4000,
        responseMimeType: 'text/plain',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response structure');
  }

  return data.candidates[0].content.parts[0].text;
}

// lib/llm/index.ts - Export único para Gemini
export { geminiChat as chatCompletion } from './gemini';
```

## To-Dos para Implementação

### Fase 1: Infraestrutura

- [ ] Criar tabelas `roast_results` no schema
- [ ] Criar `lib/llm/gemini.ts` com cliente Gemini
- [ ] Criar `services/roast/prompts.ts` com system prompts
- [ ] Criar `services/roast/parser.ts` para parse de JSON
- [ ] Criar `services/roast/scorer.ts` para cálculo de score

### Fase 2: API

- [ ] Criar `server/trpc/routers/roast.ts`
- [ ] Implementar mutation `create`
- [ ] Implementar query `getById`
- [ ] Implementar query `getByUser`

### Fase 3: UI

- [ ] Criar `components/roast/roast-container.tsx`
- [ ] Criar `components/roast/roast-score.tsx`
- [ ] Criar `components/roast/roast-issues.tsx`
- [ ] Criar `components/roast/roast-loading.tsx`
- [ ] Criar página `app/roast/[id]/page.tsx`

### Fase 4: Integração

- [ ] Integrar toggle de roast mode no code-editor
- [ ] Conectar submit ao router
- [ ] Redirecionar para página de resultado
- [ ] Testar com ambos os modos

### Fase 5: Otimização

- [ ] Adicionar cache para prompts similares
- [ ] Implementar retry com backoff
- [ ] Adicionar rate limiting
- [ ] Monitorar custos de API

## Referências

- [Google Gemini API](https://ai.google.dev/docs/gemini_api_rest)
- [Gemini Models](https://ai.google.dev/models/gemini)
- [Kilo Code Roast Mode](https://blog.kilo.ai/p/will-it-roast-we-tested-kilo-code)
- [@mj-muin/roast npm](https://registry.npmjs.org/@mj-muin/roast)
- [Sarcasmotron Review](https://gist.github.com/robhunter/5b8fd0e8e881bce6fceed45e513bbab5)
- [Roast My Code - DEV Community](https://dev.to/barrerasaezgonzalo/roast-my-code-ai-that-reviews-your-code-with-humor-and-brutality-31ej)
