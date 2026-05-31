# Tasks: Conecte os Pares

**Input**: Design documents from `/specs/006-connect-pairs/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## User Story Mapping

| Story | Title | Priority | Spec Section |
|-------|-------|----------|--------------|
| US1 | Match Pairs in a Round | P1 | User Story 1 |
| US2 | Round Results and Scoring | P1 | User Story 2 |
| US3 | Difficulty Levels with Varied Categories | P2 | User Story 3 |
| US4 | Game Selection from Home | P1 | User Story 4 |

---

## Phase 1: Setup

**Purpose**: Create the game module folder structure and type definitions

- [X] T001 Create directory structure for the connect-pairs game module: `src/games/connect-pairs/`, `src/games/connect-pairs/components/`, `src/games/connect-pairs/logic/`, `src/games/connect-pairs/data/`
- [X] T002 Create shared type definitions (PairItem, Pair, PairSet, RoundState, RoundPhase, RoundAction) in `src/games/connect-pairs/logic/types.ts` following the data model from `specs/006-connect-pairs/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core game logic and data that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Implement `shuffleArray` utility (Fisher-Yates) and `generateRound` function in `src/games/connect-pairs/logic/round-generator.ts` — accepts a `PairSet`, shuffles left and right columns independently, returns `{ leftColumn: PairItem[], rightColumn: PairItem[] }`
- [X] T004 Implement the selection state machine reducer in `src/games/connect-pairs/logic/pair-matcher.ts` — `useReducer`-based with actions: `SELECT_ITEM`, `CHECK_RESULT`, `CLEAR_FEEDBACK`, `RESET`; states: `idle`, `one-selected`, `checking`, `correct-feedback`, `incorrect-feedback`, `complete` per the state transitions in data-model.md
- [X] T005 Implement first-try tracking logic in `src/games/connect-pairs/logic/scoring.ts` — `isFirstTry(failedItems: Set<string>, leftId: string, rightId: string): boolean` and `addFailedItems(failedItems: Set<string>, leftId: string, rightId: string): Set<string>`
- [X] T006 Create the pair data module with type-safe PairSet arrays in `src/games/connect-pairs/data/pair-sets.ts` — implement at least 2 pair sets for the "Animais e Sons" category (1 easy with 4 pairs, 1 medium with 5 pairs) as initial seed data. Export `getPairSetsByDifficulty(difficulty: Difficulty): PairSet[]` and `selectPairSet(difficulty: Difficulty, excludeCategory?: string): PairSet`

**Checkpoint**: Core logic ready — game components can now be built

---

## Phase 3: User Story 1 — Match Pairs in a Round (Priority: P1) 🎯 MVP

**Goal**: Player can select items from two columns, match correct pairs with visual feedback, and complete a round by matching all pairs

**Independent Test**: Start a Connect Pairs game, select one emoji from the left column and its matching word from the right column, receive ✅ feedback for correct and ❌ for incorrect, matched pairs become disabled, round ends when all pairs matched

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `PairItem` component in `src/games/connect-pairs/components/PairItem.tsx` — renders a single selectable item with states: default, selected (primary border + scale 1.05), matched (success background + checkmark + disabled), uses framer-motion for selection/deselection animations, touch target ≥ 48px, displays `PairItem.display` text/emoji
- [X] T008 [P] [US1] Create `MatchFeedback` component in `src/games/connect-pairs/components/MatchFeedback.tsx` — overlay that shows ✅ (correct) or ❌ (incorrect) emoji with framer-motion enter/exit animation, auto-dismisses after 500ms, uses `AnimatePresence`
- [X] T009 [US1] Create `PairColumn` component in `src/games/connect-pairs/components/PairColumn.tsx` — renders a vertical list of `PairItem` components, accepts `items: PairItem[]`, `selectedId: string | null`, `matchedIds: Set<string>`, `onSelectItem: (id: string) => void`, uses flexbox column layout with `spacing.md` gap
- [X] T010 [US1] Create `ConnectPairsGame` main component in `src/games/connect-pairs/ConnectPairsGame.tsx` — receives `GameProps`, initializes round via `generateRound`/`selectPairSet` (using medium difficulty and "Animais e Sons" as default for MVP), wires `useReducer` from `pair-matcher.ts`, renders two `PairColumn` components side-by-side with `MatchFeedback` overlay, handles selection dispatch, calls `onCorrectItem()` on correct match, calls `onRoundComplete({ totalItems, correctItems: firstTryMatches, hintCount: 0 })` when all pairs matched, implements `onSaveState`/`savedState` for resume support
- [X] T011 [US1] Export default component from `src/games/connect-pairs/ConnectPairsGame.tsx` for lazy loading — ensure the file has `export default ConnectPairsGame` as required by `lazy(() => import('./ConnectPairsGame'))`

**Checkpoint**: At this point, the core matching gameplay works end-to-end with a single category. Player can select items, see feedback, and complete a round.

---

## Phase 4: User Story 2 — Round Results and Scoring (Priority: P1)

**Goal**: Player sees score, star rating, attempts, and first-try matches after completing a round. High scores trigger celebration.

**Independent Test**: Complete a round, verify the results screen shows score reflecting first-try accuracy, star rating (1-3), and celebration animation for high scores

### Implementation for User Story 2

- [X] T012 [US2] Verify `RoundResults` mapping in `ConnectPairsGame` at `src/games/connect-pairs/ConnectPairsGame.tsx` — ensure `onRoundComplete` is called with `{ totalItems: pairCount, correctItems: firstTryMatches, hintCount: 0 }` so the existing `GameShell` correctly computes score via `calculateScoreWithHints` and stars via `calculateStars`, and displays `ScoreDisplay`, `StarRating`, `CelebrationAnimation`, and "Jogar Novamente" button

**Checkpoint**: Scoring integration is complete. GameShell handles results display, celebration, and play-again flow using existing infrastructure.

---

## Phase 5: User Story 4 — Game Selection from Home (Priority: P1)

**Goal**: Connect Pairs game appears on the home page and can be launched

**Independent Test**: Navigate to the home page, verify "Conecte os Pares" card appears with icon, tap it to launch the game

### Implementation for User Story 4

- [X] T013 [P] [US4] Create `ConnectPairsIcon` component in `src/games/connect-pairs/components/ConnectPairsIcon.tsx` — accepts `{ size?: number }` prop, renders a representative icon using emoji (e.g., 🔗 or a pair-connection visual) styled consistently with existing game icons (`EmojiGuessIcon` pattern)
- [X] T014 [US4] Create plugin registration in `src/games/connect-pairs/index.ts` — export `plugin: GamePlugin` with `id: 'connect-pairs'`, `name: 'Conecte os Pares'`, `description: 'Conecte elementos que se relacionam!'`, `icon: ConnectPairsIcon`, `component: lazy(() => import('./ConnectPairsGame'))`, `defaultRoundSize: 5`, `difficulties: ['easy', 'medium', 'hard']`, `pointsPerItem: 15`
- [X] T015 [US4] Register the connect-pairs plugin in `src/games/index.ts` — add `import { plugin as connectPairs } from './connect-pairs';` and `gameRegistry.register(connectPairs);`

**Checkpoint**: Game is discoverable from the home page and fully launchable through the existing routing/GameShell flow.

---

## Phase 6: User Story 3 — Difficulty Levels with Varied Categories (Priority: P2)

**Goal**: Player can choose difficulty (easy/medium/hard) with appropriate pair counts, and encounters varied thematic categories across rounds

**Independent Test**: Select different difficulty levels and verify 4/5/6 pairs are shown respectively. Play multiple rounds and verify categories change.

### Implementation for User Story 3

- [X] T016 [US3] Expand pair data in `src/games/connect-pairs/data/pair-sets.ts` — add complete pair sets for ALL 5 categories: "Animais e Sons", "Profissões e Ferramentas", "Alimentos e Origem", "Objetos e Funções", "Emoji e Palavra". Each category MUST have at least 6 pair sets (2 easy/4 pairs, 2 medium/5 pairs, 2 hard/6 pairs). Total: ≥30 pair sets, ≥150 unique pairs. All content in PT-BR, unambiguous for ages 6-10.
- [X] T017 [US3] Update `ConnectPairsGame` in `src/games/connect-pairs/ConnectPairsGame.tsx` to use `difficulty` prop for pair count mapping (`easy→4`, `medium→5`, `hard→6`), call `selectPairSet(difficulty, lastCategory)` for category rotation, and track `lastCategory` in component state for variety across rounds
- [X] T018 [US3] Add category fallback logic in `src/games/connect-pairs/logic/round-generator.ts` — if a category has fewer pairs than required for the difficulty, fall back to another category with sufficient pairs (edge case from spec)

**Checkpoint**: All difficulty levels work with varied categories. The DifficultySelector (rendered by GameShell) controls pair count and category variety.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, responsive layout, and final quality checks

- [X] T019 Add responsive CSS styles to `ConnectPairsGame` in `src/games/connect-pairs/ConnectPairsGame.tsx` — ensure two-column layout works on mobile (≥320px) with items ≥48px tall, and on desktop (≥768px) with items ~60px tall. Use design system tokens (`spacing`, `colors`, `radii`, `typography`).
- [X] T020 Handle edge case: same-column reselection in `src/games/connect-pairs/logic/pair-matcher.ts` — verify that `SELECT_ITEM` action when the same column already has a selection replaces (not duplicates) the selection per FR-012
- [X] T021 Handle edge case: tapping matched items in `src/games/connect-pairs/components/PairItem.tsx` — verify matched items have `pointer-events: none` or ignore click events, items show reduced opacity and are visually non-interactive per FR-004
- [X] T022 Add save/restore state support in `src/games/connect-pairs/ConnectPairsGame.tsx` — implement serialization of `RoundState` for `onSaveState` callback and deserialization from `savedState` prop (convert Set to Array for JSON serialization)
- [X] T023 Verify build and lint pass by running `npm run build && npm run lint` — fix any TypeScript errors or ESLint warnings in the `src/games/connect-pairs/` module
- [X] T024 Run existing test suite with `npm run test` — verify no regressions in existing games or core infrastructure

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types defined)
- **US1 (Phase 3)**: Depends on Phase 2 — core gameplay
- **US2 (Phase 4)**: Depends on US1 — needs working round completion
- **US4 (Phase 5)**: Depends on Phase 2 — plugin registration is independent of gameplay but needs the component to exist; can be done in parallel with US1 after T011 creates the component file
- **US3 (Phase 6)**: Depends on US1 — extends data and difficulty mapping
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Core gameplay → MUST be first. Blocks US2 and US3.
- **US2 (P1)**: Scoring/results → Depends on US1 (needs `onRoundComplete` working). Lightweight integration task.
- **US4 (P1)**: Home page visibility → Can run in parallel with US1 after the component file exists (T011).
- **US3 (P2)**: Difficulty/categories → Depends on US1 for base gameplay. Extends data and round generation.

### Within Each User Story

- Types and data before logic
- Logic before components
- Components before main game assembly
- Integration before polish

### Parallel Opportunities

- T007 and T008 can run in parallel (different component files)
- T013 can run in parallel with any US1 task (independent component)
- T003, T004, T005 in Phase 2 operate on different files but T004 depends on types from T003 for `RoundState` — T003 and T005 can run in parallel
- US4 (Phase 5) can start as soon as T011 is complete, in parallel with US2

---

## Parallel Example: Phase 2 (Foundational)

```
# These can run in parallel (different files):
Task T003: "round-generator.ts" — shuffling logic
Task T005: "scoring.ts" — first-try tracking

# Then sequentially:
Task T004: "pair-matcher.ts" — depends on types/patterns from T003
Task T006: "pair-sets.ts" — seed data (can also run parallel with T004)
```

## Parallel Example: Phase 3 (User Story 1)

```
# These can run in parallel (different component files):
Task T007: "PairItem.tsx" — individual item component
Task T008: "MatchFeedback.tsx" — feedback overlay component

# Then sequentially:
Task T009: "PairColumn.tsx" — depends on PairItem (T007)
Task T010: "ConnectPairsGame.tsx" — depends on all above
Task T011: export default — trivial, depends on T010
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US4 = Phases 1-5)

1. Complete Phase 1: Setup (types and folder structure)
2. Complete Phase 2: Foundational (logic, data seed)
3. Complete Phase 3: US1 — core matching gameplay
4. Complete Phase 4: US2 — scoring integration (lightweight)
5. Complete Phase 5: US4 — home page registration
6. **STOP and VALIDATE**: Game is playable end-to-end with one category at medium difficulty
7. Build passes, existing tests pass, game accessible from home

### Incremental Delivery

1. Setup + Foundational → Logic ready
2. Add US1 → Matching gameplay works → Internal demo
3. Add US2 → Scoring and results work → MVP complete
4. Add US4 → Discoverable from home → Deployable MVP
5. Add US3 → Full difficulty/category variety → Feature complete
6. Polish → Edge cases, responsive, build validation → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This game module is entirely self-contained under `src/games/connect-pairs/`
- Only ONE file outside the module is modified: `src/games/index.ts` (T015)
- No modifications to `src/core/`, `src/design-system/`, or other game modules
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
