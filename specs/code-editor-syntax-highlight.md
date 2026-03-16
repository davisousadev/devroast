# Especificação: Editor de Código com Syntax Highlight

## 1. Resumo da Pesquisa

### 1.1 Ray-so - Análise

O **ray.so** (ferramenta da Raycast) utiliza:
- **Shiki** (`^1.0.0`) - Syntax highlighting server-side usando TextMate grammars (mesma engine do VS Code)
- **Highlight.js** (`^1.7.0`) - Para detecção automática de linguagem

O ray-so combina ambas as bibliotecas: Shiki para renderização de alta qualidade e highlight.js para detecção automática de linguagem quando o usuário não especifica.

### 1.2 Opções de Bibliotecas Analisadas

| Biblioteca | Tipo | Auto-detect | Tamanho Bundle | Uso Principal |
|------------|------|--------------|----------------|---------------|
| **Shiki** | Highlighter | Não | Médio (200+ linguagens) | Alta qualidade, VS Code-like |
| **Highlight.js** | Highlighter | **Sim** | Grande | Auto-detecção, universal |
| **PrismJS** | Highlighter | Não | Leve (300+ linguagens) | Customizável, plugins |
| **Monaco Editor** | Editor completo | Não | **Muito grande** | IDE no browser |
| **react-ace** | Wrapper Monaco | Não | Grande | IDE no browser |
| **CodeMirror 6** | Editor | Parcial | Médio | Editável, moderno |
| **prism-code-editor** | Editor leve | Não | Pequeno | Editável, Prism-based |
| **prism-react-renderer** | Highlighter React | Não | Leve | Renderização React |

## 2. Recomendação

### Abordagem Híbrida (igual ao ray-so)

Para este projeto, recomendo a **mesma abordagem do ray-so**:

1. **Shiki** - Para syntax highlighting de alta qualidade (mesma experiência visual do VS Code)
2. **Highlight.js** - Para detecção automática de linguagem
3. **Detecção manual** - Dropdown para usuário selecionar linguagem

### Por que esta abordagem?

- **Alta qualidade visual**: Shiki usa TextMate grammars, resultando em cores mais precisas e bonitas que Prism/highlight.js
- **Detecção automática**: Resolve o problema de usuário colar código sem especificar linguagem
- **Tamanho razoável**: Shiki pode ser usado server-side (Next.js) evitando bundle grande no client
- **Follow best practices**: Mesmo padrão usado pelo ray.so, VitePress, Astro, Nuxt

## 3. Funcionalidades Requeridas

### 3.1 Decisões de Design Confirmadas

- **Tipo de Editor**: Apenas exibição (não editável) - usuário cola código e visualiza com syntax highlight
- **Detecção de Linguagem**: Automática via ML + manual opcional via dropdown
- **Linguagens suportadas**: Todas as principais (JS, TS, Python, Rust, Go, Java, C++, HTML, CSS, JSON, SQL, etc.)

### 3.2 Funcionalidades Obrigatórias

- [ ] Editor de código não-editável (apenas visualização)
- [ ] Syntax highlighting automático por linguagem
- [ ] Detecção automática de linguagem (quando não especificada)
- [ ] Seleção manual de linguagem via dropdown (opcional, mas disponível)
- [ ] Suporte às linguagens mais populares (JS, TS, Python, Rust, Go, HTML, CSS, JSON, etc.)
- [ ] Tema(s) de cores escuro (dark theme)
- [ ] Linha de números

## 4. Arquitetura Técnica

### 4.1 Stack Recomendado

- **Next.js** (já utilizado no projeto)
- **Shiki** (`^1.0.0`) para rendering server-side de syntax highlighting
- **Highlight.js** (`^11.x`) para detecção automática de linguagem
- **React** com server components onde possível

### 4.2 Instalação de Dependências

```bash
npm install shiki highlight.js
# ou
pnpm add shiki highlight.js
```

### 4.3 Fluxo de Detecção de Linguagem

```
1. Código é passado para o componente
2. highlight.js detecta automaticamente a linguagem via highlightAuto()
3. Shiki renderiza o código com a linguagem detectada
4. Usuário pode sobrescrever a linguagem via dropdown
```

### 4.4 Estrutura de Componentes Sugerida

```
src/
├── components/
│   ├── code-editor/
│   │   ├── CodeEditor.tsx        # Componente principal (existente)
│   │   ├── LanguageSelector.tsx  # Dropdown de seleção
│   │   └── utils/
│   │       └── languageDetect.ts # Utilitário de detecção
```

### 4.5 Exemplo de Uso

```tsx
import { codeToHtml } from 'shiki';
import { highlightAuto } from 'highlight.js';

// Detecção automática
const detected = highlightAuto(code);
const language = detected.language;

// Renderização com Shiki
const html = await codeToHtml(code, {
  lang: language || 'plaintext',
  theme: 'github-dark', // ou outro tema
});
```

## 5. To-Dos para Implementação

### Fase 1: Setup e Instalação
- [x] **TODO 1**: Instalar dependências (shiki, highlight.js)
- [x] **TODO 2**: Configurar Shiki no projeto Next.js

### Fase 2: Detecção de Linguagem
- [x] **TODO 3**: Implementar detecção automática usando highlight.js `highlightAuto()`
- [x] **TODO 4**: Criar componente `LanguageSelector` (dropdown para seleção manual)

### Fase 3: Componente Principal
- [x] **TODO 5**: Migrar componente `CodeEditor` para usar Shiki
- [x] **TODO 6**: Adicionar linha de números
- [x] **TODO 7**: Integrar detecção automática no fluxo

### Fase 4: Integração e Testes
- [x] **TODO 8**: Integrar na homepage
- [x] **TODO 9**: Executar testes e verificar lint/typecheck

## 6. Decisões Tomadas

Após discussion com o usuário, as seguintes decisões foram confirmadas:

1. **Tipo de Editor**: Apenas exibição (não editável)
2. **Detecção de Linguagem**: Automática via highlight.js + manual opcional
3. **Linguagens**: Todas as principais linguagens de programação
