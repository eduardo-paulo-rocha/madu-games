# 🎮 Madu Games

Aplicação web progressiva (PWA) mobile-first com jogos educativos para crianças de até 10 anos. Funciona offline, sem necessidade de cadastro ou backend — todos os dados ficam no dispositivo.

## Jogos disponíveis

| Jogo | Descrição |
|------|-----------|
| **Caça-Palavras** | Encontre palavras escondidas em uma grade de letras deslizando o dedo |
| **Cruzadinha** | Complete palavras cruzadas usando dicas simples e um teclado visual |
| **Adivinhe o Emoji** | Descubra o nome do objeto ou ação representado por um emoji |

Cada jogo oferece três níveis de dificuldade (Fácil, Médio, Difícil), sistema de pontuação com estrelas (★ a ★★★) e animações de celebração ao completar desafios.

## Stack técnica

- **React 19** + **TypeScript** — UI declarativa com tipagem estrita
- **Vite** — bundler e dev server
- **Framer Motion** — animações e transições
- **Zustand** — gerenciamento de estado leve
- **IndexedDB** (via `idb`) — persistência local de sessões e pontuações
- **Vite PWA** — service worker para funcionamento offline
- **Vitest** + **Testing Library** — testes unitários
- **Playwright** — testes end-to-end
- **ESLint** + **Prettier** — linting e formatação

## Arquitetura

```
src/
├── core/               # Infraestrutura compartilhada
│   ├── hooks/          # Hooks reutilizáveis (sessão, dicas, teclado, scores)
│   ├── registry/       # Registro plugável de jogos (GamePlugin)
│   ├── scoring/        # Motor de pontuação e cálculo de estrelas
│   ├── storage/        # Camada de persistência (IndexedDB)
│   └── text/           # Normalização de texto (acentuação)
├── design-system/      # Sistema de design
│   ├── animations/     # Presets de animação
│   ├── components/     # Componentes visuais reutilizáveis
│   └── tokens/         # Design tokens (cores, espaçamento, tipografia)
├── games/              # Jogos (plugins independentes)
│   ├── word-search/    # Caça-Palavras
│   ├── crossword/      # Cruzadinha
│   └── emoji-guess/    # Adivinhe o Emoji
└── pages/              # Páginas da aplicação (Home, GameShell)
```

Novos jogos são adicionados implementando a interface `GamePlugin` e registrando-os no `GameRegistry` — nenhuma alteração nas páginas ou na navegação é necessária.

## Pré-requisitos

- **Node.js** ≥ 20
- **npm** (incluído com o Node.js)

## Início rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Rodar testes unitários
npm test

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Compilação TypeScript + build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm test` | Executa testes unitários (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:e2e` | Testes end-to-end (Playwright) |
| `npm run lint` | Verifica regras de lint (ESLint) |
| `npm run format` | Formata código (Prettier) |

## Licença

Projeto privado.
