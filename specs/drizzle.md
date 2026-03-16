# Especificação Drizzle ORM - DevRoast

## Visão Geral

Este documento especifica a configuração do Drizzle ORM com PostgreSQL no projeto DevRoast.

## Stack

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Docker Compose)
- **Driver**: `pg` (node-postgres)

## Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast123
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast -d devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Configuração de Ambiente

```env
DATABASE_URL=postgresql://devroast:devroast123@localhost:5432/devroast
```

## Tabelas

### submissions

Armazena os códigos submetidos para roast.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| code | text | NOT NULL |
| language | varchar(50) | NOT NULL |
| roast_mode | boolean | NOT NULL, default true |
| score | integer | |
| created_at | timestamptz | NOT NULL, default now() |

### roast_issues

Armazena os problemas encontrados em cada submissão.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| submission_id | uuid | FK -> submissions(id) |
| type | roast_issue_type | NOT NULL |
| title | varchar(255) | NOT NULL |
| description | text | NOT NULL |
| line | integer | |

### stats

Estatísticas globais do app.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | serial | PK |
| total_codes_roasted | integer | NOT NULL, default 0 |
| average_score | integer | NOT NULL, default 0 |
| updated_at | timestamptz | NOT NULL, default now() |

## Enums

### roast_issue_type

```typescript
export const roastIssueType = pgEnum("roast_issue_type", [
  "critical",
  "warning", 
  "good"
]);
```

## To-Dos para Implementação

### 1. Instalação de Dependências

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit
```

### 2. Configuração do Drizzle

- [x] Criar `src/db/index.ts` - conexão com PostgreSQL
- [x] Criar `src/db/schema.ts` - definições de tabelas e enums
- [x] Criar `drizzle.config.ts` - configuração do Drizzle Kit

### 3. Docker Compose

- [x] Criar `docker-compose.yml` na raiz do projeto
- [x] Adicionar script no package.json: `docker-compose up -d`

### 4. Scripts de Migration

- [x] Adicionar script: `npm run db:generate` - gera migrations
- [x] Adicionar script: `npm run db:push` - executa migrations
- [x] Adicionar script: `npm run db:studio` - abre Drizzle Studio

### 5. Operações CRUD

- [x] Criar `src/db/queries/submissions.ts` - queries para submissions
- [x] Criar `src/db/queries/stats.ts` - queries para stats
- [x] Implementar createSubmission
- [x] Implementar getLeaderboard (top 100 por score)
- [x] Implementar getStats
- [x] Implementar updateStats

### 6. Integração com API

- [ ] Integrar salvar submission após roast
- [ ] Integrar atualizar stats globais

## Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts       # Conexão
│   ├── schema.ts      # Schema tables/enums
│   └── queries/
│       ├── submissions.ts
│       └── stats.ts
```

## Referencias

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs)