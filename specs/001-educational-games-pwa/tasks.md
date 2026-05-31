# Tasks: Educational Games PWA

**Input**: Design documents from `/specs/001-educational-games-pwa/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/game-plugin.md ✅, quickstart.md ✅

**Tests**: Not explicitly requested in the feature specification. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and dependency installation

- [ ] T001 Initialize Vite + React + TypeScript project with `npm create vite@latest . -- --template react-ts` in repository root
- [ ] T002 Install production dependencies: react, react-dom, react-router-dom, zustand, framer-motion, idb
- [ ] T003 [P] Install dev dependencies: vitest, @testing-library/react, playwright, eslint, prettier, @vitejs/plugin-react, vite-plugin-pwa
- [ ] T004 [P] Configure TypeScript strict mode in tsconfig.json (strict: true, noUncheckedIndexedAccess: true, noUnusedLocals: true)
- [ ] T005 [P] Configure ESLint strict rules in eslint.config.js (react-hooks, no-unused-vars, consistent-return)
- [ ] T006 [P] Configure Prettier in .prettierrc (singleQuote, trailingComma: all, semi: true)
- [ ] T007 Create project folder structure per plan.md: src/core/, src/design-system/, src/pages/, src/games/, tests/, public/
- [ ] T008 Configure Vite with vite-plugin-pwa in vite.config.ts (precache strategy, manifest generation, workbox config)
- [ ] T009 [P] Create PWA manifest in public/manifest.json (name: "Madu Games", display: standalone, theme_color, icons placeholder)
- [ ] T010 [P] Create index.html shell with meta viewport for mobile-first, theme-color meta tag, and manifest link
- [ ] T011 Configure React Router in src/App.tsx with routes: / (home), /game/:gameId (game shell)

**Checkpoint**: Project compiles, dev server runs, empty app renders at localhost:5173

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Implement GamePlugin, GameProps, RoundResults, and Difficulty type definitions in src/core/registry/types.ts per contracts/game-plugin.md
- [ ] T013 Implement GameRegistry class (register, getAll, getById) in src/core/registry/game-registry.ts
- [ ] T014 Implement IndexedDB database setup with versioned schema (stores: sessions, scores) in src/core/storage/db.ts using idb
- [ ] T015 [P] Implement score-store (getByGameId, upsertHighScore, getAll) in src/core/storage/score-store.ts
- [ ] T016 [P] Implement session-store (create, update, getInProgress, getByGameId) in src/core/storage/session-store.ts
- [ ] T017 Implement scoring engine (calculateScore, calculateStars) in src/core/scoring/scoring-engine.ts per FR-012 and FR-023
- [ ] T018 [P] Implement text normalization utility (NFD decomposition, diacritics strip, lowercase) in src/core/text/normalize.ts
- [ ] T019 [P] Implement useGameSession hook (create session, update state, complete, abandon) in src/core/hooks/use-game-session.ts
- [ ] T020 [P] Implement useScores hook (getHighScore, updateIfBetter, getAllForGame) in src/core/hooks/use-scores.ts
- [ ] T021 Create design system tokens (colors, spacing, typography, breakpoints) in src/design-system/tokens/index.ts — child-friendly palette, large type scale
- [ ] T022 [P] Implement Button component in src/design-system/components/Button.tsx — large touch target (min 44x44px), rounded, animated press feedback
- [ ] T023 [P] Implement Card component in src/design-system/components/Card.tsx — game catalog card with icon, title, description, optional score badge
- [ ] T024 [P] Implement StarRating component in src/design-system/components/StarRating.tsx — displays 0-3 filled/empty stars with animation
- [ ] T025 [P] Implement CelebrationAnimation component in src/design-system/components/CelebrationAnimation.tsx — confetti/sparkle animation using framer-motion
- [ ] T026 [P] Implement DifficultySelector component in src/design-system/components/DifficultySelector.tsx — 3 visual buttons (★, ★★, ★★★) with labels Fácil/Médio/Difícil
- [ ] T027 [P] Implement ScoreDisplay component in src/design-system/components/ScoreDisplay.tsx — shows score, high score, stars, and optional "new record" badge
- [ ] T028 [P] Implement Keyboard component in src/design-system/components/Keyboard.tsx — child-friendly on-screen keyboard with large letter buttons (A-Z), backspace, confirm
- [ ] T029 Create shared animation presets (fadeIn, slideUp, scaleIn, celebrate) in src/design-system/animations/presets.ts using framer-motion variants
- [ ] T030 Create game registration entry point in src/games/index.ts — imports and registers all game plugins

**Checkpoint**: Foundation ready — all shared infrastructure compiles, design system renders, storage reads/writes work. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Tela Inicial e Navegação (Priority: P1) 🎯 MVP

**Goal**: A criança vê o catálogo de jogos, navega para um jogo, e retorna à tela inicial.

**Independent Test**: Abrir o app → ver cards dos jogos → tocar em um jogo → ver tela do jogo → voltar à home

### Implementation for User Story 1

- [ ] T031 [US1] Implement HomePage component in src/pages/HomePage.tsx — reads games from GameRegistry, renders grid of Card components, handles navigation to /game/:gameId
- [ ] T032 [US1] Implement GameShell component in src/pages/GameShell.tsx — wraps game component with header (back button, game name), DifficultySelector before start, ScoreDisplay after completion
- [ ] T033 [US1] Implement GameShell session lifecycle — creates GameSession on difficulty select, passes GameProps to game component, handles onRoundComplete (score screen), handles back (abandon + save state)
- [ ] T034 [US1] Add page transition animations in src/App.tsx using framer-motion AnimatePresence — slide transitions between home and game pages (< 300ms)
- [ ] T035 [US1] Implement score result screen within GameShell — displays ScoreDisplay, StarRating, CelebrationAnimation (if stars > 0), "new record" indicator, and "Jogar Novamente" / "Voltar" buttons

**Checkpoint**: App shows game catalog, user can navigate into a game shell (with placeholder content) and back. Session lifecycle (create → in-progress → complete/abandon) works end-to-end.

---

## Phase 4: User Story 2 — Caça-Palavras (Priority: P2)

**Goal**: A criança joga Caça-Palavras com swipe para selecionar palavras na grade.

**Independent Test**: Selecionar Caça-Palavras → escolher dificuldade → ver grade de letras → deslizar para marcar palavras → completar → ver pontuação

### Implementation for User Story 2

- [ ] T036 [P] [US2] Create word lists (PT-BR, child-appropriate) in src/games/word-search/data/words-easy.json (3-5 letter words, ~50 words), words-medium.json (4-7 letters, ~50 words), words-hard.json (6-10 letters, ~50 words)
- [ ] T037 [US2] Implement grid generation algorithm in src/games/word-search/logic/grid-generator.ts — places N words (based on roundSize) in random directions (horizontal, vertical, diagonal), fills remaining cells with random letters
- [ ] T038 [US2] Implement word validation logic in src/games/word-search/logic/word-validator.ts — checks if a sequence of cell coordinates forms a valid word from the round's word list (uses normalize.ts for comparison)
- [ ] T039 [US2] Implement swipe/pan gesture handler in src/games/word-search/components/GridCell.tsx and SwipeDetector.tsx — uses framer-motion onPan to track finger movement across grid cells, highlights cells under finger
- [ ] T040 [US2] Implement WordSearchGame main component in src/games/word-search/WordSearchGame.tsx — orchestrates grid display, word list sidebar, swipe detection, found-word highlighting, round completion
- [ ] T041 [US2] Implement word list display component in src/games/word-search/components/WordList.tsx — shows words to find with strikethrough for found words
- [ ] T042 [US2] Implement WordSearchIcon component in src/games/word-search/components/WordSearchIcon.tsx — visual icon for the home screen card
- [ ] T043 [US2] Create plugin registration in src/games/word-search/index.ts — exports GamePlugin with id "word-search", name "Caça-Palavras", defaultRoundSize 6, pointsPerItem 10
- [ ] T044 [US2] Implement save/restore state for word-search — serialize grid state + found words for resume via onSaveState/savedState

**Checkpoint**: Caça-Palavras is fully playable, scores are saved per difficulty, game appears in catalog. Round generates varied content.

---

## Phase 5: User Story 3 — Cruzadinha (Priority: P3)

**Goal**: A criança joga Cruzadinha com digitação de letras em células do tabuleiro.

**Independent Test**: Selecionar Cruzadinha → escolher dificuldade → ver tabuleiro + dicas → digitar letras → completar palavras → ver pontuação

### Implementation for User Story 3

- [ ] T045 [P] [US3] Create clue data (PT-BR, child-appropriate) in src/games/crossword/data/clues-easy.json (~30 word+clue pairs, 3-5 letter words), clues-medium.json (~30, 4-7 letters), clues-hard.json (~30, 6-10 letters)
- [ ] T046 [US3] Implement crossword puzzle generation algorithm in src/games/crossword/logic/puzzle-generator.ts — selects N words (roundSize), places them on a grid with intersections, generates crossword layout
- [ ] T047 [US3] Implement crossword grid component in src/games/crossword/components/CrosswordGrid.tsx — renders cells, handles cell selection (tap), highlights active word direction, shows cell numbers
- [ ] T048 [US3] Implement clue display component in src/games/crossword/components/ClueList.tsx — shows clues for horizontal/vertical words, highlights active clue
- [ ] T049 [US3] Implement letter input logic in src/games/crossword/logic/input-handler.ts — validates input (letters only), advances to next cell in word, uses normalize.ts for comparison with correct answer
- [ ] T050 [US3] Implement CrosswordGame main component in src/games/crossword/CrosswordGame.tsx — orchestrates grid, clues, keyboard input, word completion detection, round completion
- [ ] T051 [US3] Implement CrosswordIcon component in src/games/crossword/components/CrosswordIcon.tsx — visual icon for the home screen card
- [ ] T052 [US3] Create plugin registration in src/games/crossword/index.ts — exports GamePlugin with id "crossword", name "Cruzadinha", defaultRoundSize 5, pointsPerItem 10
- [ ] T053 [US3] Implement save/restore state for crossword — serialize grid state + filled letters for resume via onSaveState/savedState

**Checkpoint**: Cruzadinha is fully playable, scores are saved per difficulty, game appears in catalog alongside Caça-Palavras.

---

## Phase 6: User Story 4 — Adivinhe o Emoji (Priority: P4)

**Goal**: A criança adivinha o significado de emojis digitando a palavra correspondente.

**Independent Test**: Selecionar Adivinhe o Emoji → escolher dificuldade → ver emoji → digitar resposta → acertar → próximo emoji → completar rodada → ver pontuação

### Implementation for User Story 4

- [ ] T054 [P] [US4] Create curated emoji dictionary in src/games/emoji-guess/data/emoji-dictionary.json — ~80 entries with emoji, accepted words (including synonyms), and difficulty classification, all appropriate for children ≤10 years
- [ ] T055 [US4] Implement emoji round selection logic in src/games/emoji-guess/logic/round-selector.ts — selects N emojis (roundSize) for the chosen difficulty, avoids repetition from recent sessions
- [ ] T056 [US4] Implement answer validation logic in src/games/emoji-guess/logic/answer-validator.ts — normalizes input (normalize.ts), compares against accepted words list, filters only letters (FR-018)
- [ ] T057 [US4] Implement EmojiGuessGame main component in src/games/emoji-guess/EmojiGuessGame.tsx — displays emoji, input field, Keyboard, validates answer, advances to next emoji or completes round
- [ ] T058 [US4] Implement emoji display component in src/games/emoji-guess/components/EmojiDisplay.tsx — renders emoji at large size with animation on transition between emojis
- [ ] T059 [US4] Implement answer input component in src/games/emoji-guess/components/AnswerInput.tsx — text field restricted to letters only, integrates with Keyboard component, shows gentle hint on incorrect answer
- [ ] T060 [US4] Implement EmojiGuessIcon component in src/games/emoji-guess/components/EmojiGuessIcon.tsx — visual icon for the home screen card
- [ ] T061 [US4] Create plugin registration in src/games/emoji-guess/index.ts — exports GamePlugin with id "emoji-guess", name "Adivinhe o Emoji", defaultRoundSize 8, pointsPerItem 10
- [ ] T062 [US4] Implement save/restore state for emoji-guess — serialize current emoji index + answered emojis for resume via onSaveState/savedState

**Checkpoint**: Adivinhe o Emoji is fully playable, emoji dictionary validates correctly (including synonyms), scores saved per difficulty.

---

## Phase 7: User Story 5 — Pontuação e Gamificação (Priority: P5)

**Goal**: A criança vê recordes, estrelas, e animações de conquista em todos os jogos.

**Independent Test**: Completar partidas → ver estrelas no resultado → ver recorde na home → bater recorde → ver animação de "novo recorde"

### Implementation for User Story 5

- [ ] T063 [US5] Enhance HomePage Card component to display high score badge and best stars per game (read from useScores hook) in src/pages/HomePage.tsx
- [ ] T064 [US5] Implement "new record" detection logic in GameShell score screen — compare session score with stored highScore, trigger special animation if new record
- [ ] T065 [US5] Implement NewRecordAnimation component in src/design-system/components/NewRecordAnimation.tsx — special celebratory animation (larger, more particles) for when the player beats their high score
- [ ] T066 [US5] Implement "not yet played" state for game cards in HomePage — show inviting visual (e.g., sparkle/question mark) when no scores exist for a game+difficulty

**Checkpoint**: Gamification loop complete — scores persist, records tracked per game+difficulty, visual feedback for achievements.

---

## Phase 8: User Story 6 — Funcionamento Offline / PWA (Priority: P6)

**Goal**: O app funciona 100% offline após primeiro carregamento e é instalável como PWA.

**Independent Test**: Instalar PWA → desligar internet → abrir app → jogar todos os jogos → verificar pontuações salvam → verificar app abre standalone

### Implementation for User Story 6

- [ ] T067 [US6] Configure Workbox precaching strategy in vite.config.ts — precache all static assets (JS chunks, JSON data files, fonts, icons), set navigateFallback to index.html
- [ ] T068 [US6] Implement service worker registration in src/main.tsx — register SW on first load, handle update detection with user prompt
- [ ] T069 [US6] Create PWA icons in public/icons/ — generate icon set (192x192, 512x512, maskable) with child-friendly Madu Games branding
- [ ] T070 [US6] Finalize manifest.json with complete configuration — start_url: "/", display: standalone, orientation: portrait, background_color, categories, screenshots for install prompt
- [ ] T071 [US6] Implement offline fallback handling — graceful error boundary if any asset fails, informative message if storage is full (edge case)
- [ ] T072 [US6] Add install prompt UX — capture beforeinstallprompt event, show non-intrusive "Instalar" button after first game completion, iOS manual instruction fallback

**Checkpoint**: App passes Lighthouse PWA audit ≥ 95. Works fully offline. Installable on Android, iOS, and Windows.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T073 [P] Performance audit — verify < 5MB bundle (run build + analyze), verify 60fps animations (Chrome DevTools), verify < 300ms transitions
- [ ] T074 [P] Accessibility pass — verify 44x44px touch targets, color contrast ratios (WCAG AA), focus indicators for keyboard navigation
- [ ] T075 [P] Responsive testing — verify layout at 320px, 375px, 414px, 768px widths; ensure grid adapts correctly
- [ ] T076 [P] Add loading states — Suspense fallbacks for lazy-loaded game components with child-friendly spinner/skeleton
- [ ] T077 Code cleanup — remove any dead code, verify no TODO hacks remain, ensure consistent naming across modules
- [ ] T078 Run quickstart.md validation — follow all setup steps from scratch, verify dev server starts, all games load, offline works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): MUST complete first (provides navigation shell all games need)
  - User Stories 2, 3, 4 (P2-P4): Can proceed in parallel AFTER US1 is complete
  - User Story 5 (P5): Can start after at least one game (US2) is complete
  - User Story 6 (P6): Can start after all games are complete (needs full asset list for precaching)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 — Provides GameShell that all games render inside
- **User Story 2 (P2)**: Depends on US1 — Needs GameShell + HomePage navigation
- **User Story 3 (P3)**: Depends on US1 — Needs GameShell + HomePage navigation. Independent of US2.
- **User Story 4 (P4)**: Depends on US1 — Needs GameShell + HomePage navigation. Independent of US2/US3.
- **User Story 5 (P5)**: Depends on US1 + at least one game (US2/US3/US4) — Needs scores to display
- **User Story 6 (P6)**: Depends on US1-US4 — Needs all assets to precache

### Within Each User Story

- Models/types before logic
- Logic before components
- Components before main game orchestrator
- Plugin registration after main component
- Save/restore state last (after game works end-to-end)

### Parallel Opportunities

- All Phase 2 tasks marked [P] can run in parallel (T015-T016, T018-T020, T022-T029)
- After US1 completes, US2/US3/US4 can all run in parallel (different folders, no shared state)
- All Phase 9 tasks marked [P] can run in parallel
- Within each game: data files [P] with logic implementation

---

## Parallel Example: After Phase 3 (US1) Completes

```bash
# All three games can start simultaneously:
Developer A: Phase 4 (Caça-Palavras) — src/games/word-search/
Developer B: Phase 5 (Cruzadinha) — src/games/crossword/
Developer C: Phase 6 (Adivinhe o Emoji) — src/games/emoji-guess/
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (navigation shell)
4. Complete Phase 4: User Story 2 (Caça-Palavras)
5. **STOP and VALIDATE**: Test US1 + US2 independently → App is usable with one game
6. Deploy/demo as MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Navigation works (shell only)
3. Add User Story 2 → First game playable → **MVP!**
4. Add User Story 3 → Second game playable
5. Add User Story 4 → Third game playable
6. Add User Story 5 → Gamification & records visible
7. Add User Story 6 → Full PWA, offline, installable
8. Polish → Performance, accessibility, cleanup

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. One developer: User Story 1 (blocks others)
3. Once US1 is done:
   - Developer A: User Story 2 (Caça-Palavras)
   - Developer B: User Story 3 (Cruzadinha)
   - Developer C: User Story 4 (Adivinhe o Emoji)
4. Any developer: User Story 5 (after any game completes)
5. Any developer: User Story 6 (after all games complete)
6. All: Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable after US1
- Commit after each task or logical group
- Content data files (word lists, emoji dictionary) should be curated carefully for age-appropriateness
- All text content must be in Português Brasileiro
