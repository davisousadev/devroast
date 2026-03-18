# Regras do Agente

## Convenções de Código

- **Tailwind**: Usar classes nativas do Tailwind ao invés de valores hexadecimais
  - Exemplo: `text-emerald-500` ao invés de `text-[#10B981]`
  - Exemplo: `h-15` ao invés de `h-[60px]`
- **Componentes UI**: Components em `src/components/ui/`
- **biome**: Linter e formatter configurado no `biome.json`
- **Queries Paralelas**: Em Server Components, usar `Promise.all` para executar múltiplas queries em paralelo ao invés de sequencialmente

## Estrutura de Commits (Conventional Commits)

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração
style: formatação
chore: tarefas diversas
docs: documentação
```

## Design

- Design originado do arquivo `devroast.pen`, disponível no próprio Pencil via conexão MCP
- Usar variáveis CSS do Tailwind para cores
- Fonte: JetBrains Mono (mono)
