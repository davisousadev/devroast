# Especificação tRPC - DevRoast

## Visão Geral

Este documento especifica a configuração do tRPC com TanStack React Query no projeto DevRoast, integrado com Next.js App Router e Server Components.

## Stack

- **Framework**: tRPC v11
- **Query Client**: TanStack React Query v5
- **Validação**: Zod
- **Adapter**: Fetch (Next.js App Router)

## Instalação de Dependências

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod superjson server-only client-only
```

## Estrutura de Arquivos

```
src/
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts
├── server/
│   └── trpc/
│       ├── init.ts
│       ├── query-client.ts
│       ├── client.tsx
│       ├── server.tsx
│       └── routers/
│           ├── _app.ts
│           └── submissions.ts
```

## Configuração

### 1. Inicialização (server/trpc/init.ts)

```typescript
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return {};
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### 2. Query Client (server/trpc/query-client.ts)

```typescript
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}
```

### 3. Router Principal (server/trpc/routers/_app.ts)

```typescript
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => {
      return { greeting: `hello ${opts.input.text}` };
    }),
});

export type AppRouter = typeof appRouter;
```

### 4. API Route (app/api/trpc/[trpc]/route.ts)

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/server/trpc/init';
import { appRouter } from '@/server/trpc/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

## Server Components

### 1. Client Provider (server/trpc/client.tsx)

```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

### 2. Server Utils (server/trpc/server.tsx)

```typescript
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createTRPCContext());
```

## Uso

### Server Component (com prefetch)

```typescript
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/server/trpc/server';

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: 'world' }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

### Client Component

```typescript
'use client';
import { useTRPC } from '@/server/trpc/client';

export function ClientComponent() {
  const trpc = useTRPC();
  const { data } = trpc.hello.useQuery({ text: 'world' });
  return <div>{data?.greeting}</div>;
}
```

### Direct Server Call

```typescript
import { caller } from '@/server/trpc/server';

export default async function Page() {
  const result = await caller.hello({ text: 'world' });
  return <div>{result.greeting}</div>;
}
```

## To-Dos para Implementação

### 1. Instalação

- [ ] Instalar dependências

### 2. Configuração Backend

- [ ] Criar `src/server/trpc/init.ts`
- [ ] Criar `src/server/trpc/query-client.ts`
- [ ] Criar `src/server/trpc/routers/_app.ts`
- [ ] Criar API route `src/app/api/trpc/[trpc]/route.ts`

### 3. Configuração Frontend

- [ ] Criar `src/server/trpc/client.tsx`
- [ ] Criar `src/server/trpc/server.tsx`
- [ ] Adicionar TRPCReactProvider no `layout.tsx`

### 4. Routers de Exemplo

- [ ] Criar router para submissions
- [ ] Criar router para stats

## Referências

- [tRPC Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [tRPC Setup](https://trpc.io/docs/client/tanstack-react-query/setup)
