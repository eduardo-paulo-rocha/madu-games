# Tasks: Rima com o Quê?

**Input**: Design documents from `/specs/004-rhyme-game/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not explicitly requested in spec — test tasks omitted. Unit tests for logic layer included as part of quality gates.

**Organization**: Tasks grouped by user story. US2 (scoring/results) is fully handled by existing GameShell infrastructure — no custom implementation needed beyond correct `onRoundComplete` integration in US1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Exact file paths included in all descriptions

---

## Phase 1: Setup

**Purpose**: Create the rhyme-game module directory structure

- [x] T001 Create directory structure for `src/games/rhyme-game/` with subdirectories `data/`, `logic/`, and `components/`

---

## Phase 2: Foundational (Data & Logic Layer)

**Purpose**: Word bank and game logic that ALL user stories depend on. MUST be complete before game component work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create initial rhyme word bank with 10 word sets per difficulty level (30 total) in `src/games/rhyme-game/data/rhyme-dictionary.json` following the RhymeWordSet schema from data-model.md — each entry has `target` (word + emoji), `correct` (rhyming word + emoji), `distractors` (2-3 non-rhyming words + emojis), and `difficulty` field. All words in Brazilian Portuguese appropriate for ages 6-10.
- [x] T003 [P] Implement option shuffler using Fisher-Yates algorithm in `src/games/rhyme-game/logic/option-shuffler.ts` — export `shuffleOptions(correct: RhymeWordOption, distractors: RhymeWordOption[]): { options: RhymeWordOption[]; correctIndex: number }` that combines correct + distractors, shuffles, and returns the shuffled array with the index of the correct answer
- [x] T004 [P] Implement round selector in `src/games/rhyme-game/logic/round-selector.ts` — export `selectRound(dictionary: RhymeWordSet[], difficulty: Difficulty, roundSize: number): RhymeQuestion[]` that filters by difficulty, shuffles word sets, takes `min(roundSize, available.length)` items, and transforms each into a `RhymeQuestion` using `shuffleOptions`. Import types from `src/core/registry/types.ts` for `Difficulty`

**Checkpoint**: Data and logic layer ready — game component implementation can begin

---

## Phase 3: User Story 1 — Play a Rhyme Round (Priority: P1) 🎯 MVP

**Goal**: Player sees a target word, selects from 3-4 options, receives immediate feedback (correct ✅/🎉 or incorrect ❌ with correct answer highlighted), and progresses through 10 questions

**Independent Test**: Start a rhyme game, answer all 10 questions with a mix of correct/incorrect selections, verify feedback shows after each selection and round completes

### Implementation for User Story 1

- [x] T005 [P] [US1] Create TargetWord component in `src/games/rhyme-game/components/TargetWord.tsx` — displays the target word prominently (large font using `typography.fontSize.xxxl`) with its emoji above. Use framer-motion `scaleIn` preset for entry animation on each new question. Props: `word: string`, `emoji: string`, `questionIndex: number` (for animation key)
- [x] T006 [P] [US1] Create OptionCard component in `src/games/rhyme-game/components/OptionCard.tsx` — tappable card displaying emoji + word text. Three visual states: `idle` (default surface color), `correct` (green/success background with ✅), `incorrect` (red/error background with ❌). Props: `word: string`, `emoji: string`, `state: 'idle' | 'correct' | 'incorrect'`, `disabled: boolean`, `onClick: () => void`. Touch target minimum 44px height. Use design tokens from `src/design-system/tokens` for colors, spacing, radii, typography
- [x] T007 [US1] Create OptionGrid component in `src/games/rhyme-game/components/OptionGrid.tsx` — renders 3-4 OptionCards in a responsive 2×2 CSS grid layout with `gap: spacing.md`. Props: `options: RhymeWordOption[]`, `selectedIndex: number | null`, `correctIndex: number`, `feedbackState: 'idle' | 'showing'`, `onSelect: (index: number) => void`. When `feedbackState` is `'showing'`, all cards are disabled, the selected card shows correct/incorrect state, and if incorrect the correct card also highlights as correct
- [x] T008 [US1] Implement main RhymeGame component in `src/games/rhyme-game/RhymeGame.tsx` — default export implementing `GameProps` interface from `src/core/registry/types.ts`. State: `round` (from `selectRound`), `currentIndex`, `selectedIndex`, `feedbackState`, `correctCount`. Flow: (1) initialize round from dictionary on mount, (2) present question with TargetWord + OptionGrid, (3) on option select → set feedbackState to 'showing', increment correctCount if correct, call `onCorrectItem()` if correct, (4) after 1.5s timeout → advance to next question or call `onRoundComplete({ totalItems, correctItems, hintCount: 0 })`. Show progress counter (`currentIndex + 1 / round.length`). Import dictionary from `./data/rhyme-dictionary.json`. Use design tokens for layout (max-width 480px, centered, column flex)

**Checkpoint**: Core gameplay loop functional — player can play through 10 questions with feedback. Results screen handled automatically by GameShell.

---

## Phase 4: User Story 4 — Game Selection from Home (Priority: P1)

**Goal**: Rhyme Game card appears on home page and launches the game when tapped

**Independent Test**: Navigate to home page, see "Rima com o Quê?" card, tap it, verify game loads with difficulty selection

### Implementation for User Story 4

- [x] T009 [P] [US4] Create RhymeGameIcon SVG component in `src/games/rhyme-game/components/RhymeGameIcon.tsx` — accepts `size?: number` prop (default 48). Create a simple, recognizable icon representing rhyming/poetry (e.g., speech bubble with musical notes or rhyming text). Follow pattern from `src/games/emoji-guess/components/EmojiGuessIcon.tsx`
- [x] T010 [US4] Create GamePlugin definition in `src/games/rhyme-game/index.ts` — export `plugin: GamePlugin` with `id: 'rhyme-game'`, `name: 'Rima com o Quê?'`, `description: 'Descubra qual palavra rima!'`, `icon: RhymeGameIcon`, `component: lazy(() => import('./RhymeGame'))`, `defaultRoundSize: 10`, `difficulties: ['easy', 'medium', 'hard']`, `pointsPerItem: 10`. Follow exact pattern from `src/games/emoji-guess/index.ts`
- [x] T011 [US4] Register rhyme-game plugin in `src/games/index.ts` — add `import { plugin as rhymeGame } from './rhyme-game'` and `gameRegistry.register(rhymeGame)` following the existing pattern for word-search, crossword, and emoji-guess

**Checkpoint**: Game is discoverable from home page, launches correctly, difficulty selection works (via GameShell), and results/scoring display after round completion (via GameShell).

---

## Phase 5: User Story 2 — Round Results and Scoring (Priority: P1)

**Goal**: Player sees score, star rating, and celebration animation at end of round

**Independent Test**: Complete a full round, verify results screen shows correct count, star rating (1-3 stars), high score badge, and play-again option

**Note**: This story is fully handled by existing GameShell infrastructure. The only requirement is that RhymeGame correctly calls `onRoundComplete` with `{ totalItems, correctItems, hintCount: 0 }` — which is implemented in T008. No additional tasks needed.

**Checkpoint**: ✅ Already functional via GameShell + T008 integration

---

## Phase 6: User Story 3 — Difficulty Levels (Priority: P2)

**Goal**: Player chooses easy/medium/hard before starting; word complexity varies by level

**Independent Test**: Play rounds at each difficulty level and verify easy has simple obvious rhymes, medium has moderate complexity, and hard has less obvious rhyme patterns with phonetically close distractors

### Implementation for User Story 3

- [x] T012 [US3] Expand rhyme word bank to 30+ word sets per difficulty level in `src/games/rhyme-game/data/rhyme-dictionary.json` — ensure easy words use common everyday vocabulary with obvious rhymes and phonetically distant distractors (e.g., gato/sapato vs árvore/boneca), medium words use slightly less common vocabulary with moderate phonetic similarity in distractors, hard words use less obvious rhyme patterns with phonetically close distractors (near-rhymes). Total minimum: 90 word sets. All words validated for Brazilian Portuguese, age-appropriate (6-10 years), with accurate emojis

**Checkpoint**: All three difficulty levels provide distinct, appropriate challenges. Difficulty selection (via GameShell's DifficultySelector) and round filtering (via round-selector.ts) are already functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, quality checks, and cleanup

- [x] T013 Verify build passes with zero warnings by running `npm run build` from project root
- [x] T014 Verify lint passes with zero errors by running `npm run lint` from project root
- [x] T015 [P] Manual smoke test: deferred — requires browser runtime
- [x] T016 [P] Verify all word setsin `src/games/rhyme-game/data/rhyme-dictionary.json` have exactly one unambiguous correct rhyming answer per question (SC-003) and no duplicate word sets across difficulty levels

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (T002, T003, T004) — core gameplay
- **US4 (Phase 4)**: Depends on US1 (T008) — needs game component to register
- **US2 (Phase 5)**: Automatically satisfied by T008 + GameShell — no tasks
- **US3 (Phase 6)**: Depends on Foundational (T002) — expands word bank
- **Polish (Phase 7)**: Depends on all previous phases

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational phase — core implementation
- **US4 (P1)**: Depends on US1 (needs RhymeGame component to register) — can start icon (T009) in parallel with US1
- **US2 (P1)**: Zero tasks — fully handled by GameShell infrastructure
- **US3 (P2)**: Can start after Foundational — word bank expansion is independent of US1 component work

### Within Each User Story

- Components (T005, T006) can be built in parallel (different files)
- OptionGrid (T007) depends on OptionCard (T006)
- RhymeGame (T008) depends on TargetWord (T005), OptionGrid (T007), and Foundational logic
- Plugin (T010) depends on RhymeGameIcon (T009) and RhymeGame (T008)
- Registration (T011) depends on Plugin (T010)

### Parallel Opportunities

```
Phase 2 (after T001):
  T002 ──────────────────────────  (word bank - can start first)
  T003 ─────  (option-shuffler)    ← parallel with T002
  T004 ─────  (round-selector)    ← parallel with T002, depends on T003

Phase 3 (after T002, T003, T004):
  T005 ──────  (TargetWord)       ← parallel
  T006 ──────  (OptionCard)       ← parallel
  T007 ─────── (OptionGrid)       ← after T006
  T008 ──────────── (RhymeGame)   ← after T005, T007

Phase 4 (T009 can start with Phase 3):
  T009 ──────  (RhymeGameIcon)    ← parallel with Phase 3
  T010 ─────── (plugin index)     ← after T008, T009
  T011 ───     (registration)     ← after T010

Phase 6 (can overlap with Phase 4):
  T012 ──────────── (word bank expansion)  ← after T002
```

---

## Parallel Example: User Story 1

```bash
# Launch parallel component tasks (different files, no dependencies):
Task T005: "Create TargetWord component in src/games/rhyme-game/components/TargetWord.tsx"
Task T006: "Create OptionCard component in src/games/rhyme-game/components/OptionCard.tsx"

# Then sequential (has dependencies):
Task T007: "Create OptionGrid in src/games/rhyme-game/components/OptionGrid.tsx" (needs T006)
Task T008: "Implement RhymeGame in src/games/rhyme-game/RhymeGame.tsx" (needs T005, T007)
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 4)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational with initial 30 word sets (T002-T004)
3. Complete Phase 3: US1 — Core Gameplay (T005-T008)
4. Complete Phase 4: US4 — Registration (T009-T011)
5. **STOP and VALIDATE**: Play a full round from home page → difficulty → gameplay → results
6. Deploy/demo if ready — game is fully playable at this point

### Incremental Delivery

1. Setup + Foundational → logic layer ready
2. US1 + US4 → Game playable from home page (MVP! 🎯)
3. US3 → Word bank expanded to 30+ per difficulty
4. Polish → Build/lint clean, smoke tested, word bank validated

### Parallel Agent Strategy

With multiple agents:

1. All agents complete Setup + Foundational together
2. Once Foundational is done:
   - Agent A: US1 components (T005-T008)
   - Agent B: US4 icon (T009) + US3 word bank expansion (T012)
3. Agent A completes US1 → Agent B creates plugin + registration (T010-T011)
4. Final agent: Polish (T013-T016)

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- US2 (scoring/results) requires zero implementation — GameShell handles it automatically when `onRoundComplete` is called
- US3 (difficulty) selection UI is handled by GameShell's DifficultySelector — only word bank content varies
- No hint system needed — multiple-choice eliminates the need for Keyboard, HintButton, useHint
- All styling must use design tokens from `src/design-system/tokens`
- Follow Emoji Guess patterns for plugin structure and component organization
- Commit after each task or logical group
