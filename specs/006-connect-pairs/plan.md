# Implementation Plan: Conecte os Pares

**Branch**: `006-connect-pairs` | **Date**: 2026-05-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-connect-pairs/spec.md`

## Summary

Novo jogo "Conecte os Pares" onde a criança conecta elementos relacionados de duas colunas (emoji ↔ palavra, animal ↔ som, etc.). Implementado como um game plugin seguindo o padrão existente (`GamePlugin` interface), com dados de pares curados por categoria, lógica de matching com seleção uma-por-coluna, feedback visual imediato (✅/❌), e pontuação baseada em acertos e tentativas. Suporte a 3 níveis de dificuldade (4/5/6 pares) com pelo menos 5 categorias temáticas e 6 conjuntos de pares cada.

## Technical Context

**Language/Version**: TypeScript 6.0+ (strict mode)

**Primary Dependencies**: React 19+ (hooks, lazy loading), framer-motion (animações de feedback e conexão), zustand (state management), react-router-dom (navegação)

**Storage**: IndexedDB via idb (sessões e pontuações via infraestrutura existente) — sem backend

**Testing**: Vitest (unit/integration), Testing Library (component tests), Playwright (E2E)

**Target Platform**: PWA instalável — smartphones Android 8+, iOS 14+, desktop (Chrome/Edge). Mobile-first, responsivo 320px-1024px.

**Project Type**: PWA / SPA (client-only, zero-backend) — novo módulo de jogo

**Performance Goals**: 60 fps em animações de seleção/feedback; feedback visual < 500ms (SC-002); carregamento do jogo < 2s (SC-004)

**Constraints**: Offline-capable (dados bundled); touch targets ≥ 44x44px; conteúdo em PT-BR para crianças 6-10 anos; nenhuma modificação em outros jogos ou core

**Scale/Scope**: 1 novo jogo, ~5 telas (setup + gameplay + resultados), ~10-15 componentes novos, 5+ categorias × 6+ conjuntos de pares cada

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Code Quality | ✅ PASS | TypeScript strict, Vitest para toda lógica, ESLint configurado |
| II. Simplicity | ✅ PASS | Módulo auto-contido, sem nova infra, reutiliza GamePlugin/scoring/design-system |
| III. UX Consistency | ✅ PASS | Usa design system existente (Card, Button, StarRating, CelebrationAnimation, DifficultySelector) |
| IV. Performance | ✅ PASS | Lazy loading do componente, animações framer-motion, sem hot path complexo |
| V. Maintainability | ✅ PASS | Estrutura espelha jogos existentes (emoji-guess, word-search), single-responsibility |
| VI. Extensibility | ✅ PASS | Plugin pattern via GameRegistry, zero coupling com outros jogos |

**Gate Result**: PASS — nenhuma violação detectada. Prosseguindo para Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/006-connect-pairs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── connect-pairs-game.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/games/connect-pairs/
├── index.ts                    # Plugin registration export
├── ConnectPairsGame.tsx        # Main game component (receives GameProps)
├── components/
│   ├── ConnectPairsIcon.tsx    # Icon for home page card
│   ├── PairColumn.tsx          # Renders a single column of items
│   ├── PairItem.tsx            # Individual selectable item
│   ├── ConnectionLine.tsx      # Visual line connecting matched pairs
│   └── MatchFeedback.tsx       # ✅/❌ feedback overlay
├── logic/
│   ├── pair-matcher.ts         # Match validation, selection state machine
│   ├── round-generator.ts      # Selects pair set, shuffles columns
│   └── scoring.ts              # Attempt tracking, first-try bonus calculation
└── data/
    └── pair-sets.ts            # Curated pair data by category and difficulty
```

**Structure Decision**: Módulo auto-contido sob `src/games/connect-pairs/` seguindo o padrão idêntico aos jogos existentes (emoji-guess, word-search, crossword). Cada sub-pasta (components, logic, data) espelha a organização dos outros jogos. Nenhum arquivo fora de `src/games/connect-pairs/` é criado — apenas `src/games/index.ts` é modificado para registrar o novo plugin.

## Complexity Tracking

> Nenhuma violação da constituição detectada — tabela não necessária.
