# Tasks: Sequência Lógica

**Input**: Design documents from `/specs/005-logical-sequence/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature spec. Tests are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Create the game module directory structure and shared types

- [x] T001 Create game module directory structure: `src/games/logical-sequence/`, `src/games/logical-sequence/components/`, `src/games/logical-sequence/logic/`

---

## Phase 2: Foundational (Pattern Engine)

**Purpose**: Core pattern generation logic that ALL user stories depend on. Pure functions with no UI — independently testable.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Define PatternRule type, PatternInstance type, EmojiSet type, and DifficultyConfig type in `src/games/logical-sequence/logic/pattern-rules.ts` — include the curated emoji sets (colors/shapes, animals, fruits, nature, objects) and pattern rule definitions for all pattern types (alternation, cycle, growth, nested) per data-model.md and research.md R1/R2
- [x] T003 Implement `generatePattern` function in `src/games/logical-sequence/logic/pattern-generator.ts` — takes a PatternRule + emoji array + sequence length + options count, returns a PatternInstance with the correct answer at `rule(lastIndex)`, same-category distractors, and randomized option positions per research.md R1/R4
- [x] T004 Implement `generateRound` function in `src/games/logical-sequence/logic/round-generator.ts` — takes difficulty and roundSize (default 10), selects pattern rules for the difficulty level, randomly pairs with emoji sets, returns `PatternInstance[]` per research.md R3/R5. Map difficulty to config: easy = AB alternation, 4-5 visible, 2 options; medium = ABC cycle + growth, 5-6 visible, 3 options; hard = nested + growth + longer cycles, 6-8 visible, 3 options

**Checkpoint**: Pattern engine ready — all pattern generation is functional and deterministic

---

## Phase 3: User Story 1 — Solve a Pattern Sequence (Priority: P1) 🎯 MVP

**Goal**: Child player sees an emoji sequence with ❓, selects the correct completion, and receives immediate visual feedback

**Independent Test**: Start game → view pattern like 🔴🔵🔴🔵❓ → select correct emoji (🔴) → see ✅ feedback → advance to next pattern → complete 10 patterns

### Implementation for User Story 1

- [x] T005 [P] [US1] Create PatternDisplay component in `src/games/logical-sequence/components/PatternDisplay.tsx` — renders a horizontal row of emoji characters from `PatternInstance.sequence` with the last position showing ❓ (or the correct answer after selection). Use design system tokens for spacing, typography (xxxl emoji size), and `scaleIn` animation preset for each emoji. Must support replacing ❓ with the correct answer on correct selection.
- [x] T006 [P] [US1] Create OptionButtons component in `src/games/logical-sequence/components/OptionButtons.tsx` — renders 2-3 tappable emoji buttons from `PatternInstance.options`. Each button uses design system Button-like styling with `tokens.radii.lg`, min touch target 44px. On tap, calls `onSelect(emoji)`. After selection, highlight correct option in `colors.success` and incorrect in `colors.error`. Disable all buttons after selection.
- [x] T007 [P] [US1] Create FeedbackOverlay component in `src/games/logical-sequence/components/FeedbackOverlay.tsx` — shows ✅🎉 (correct) or ❌ (incorrect) centered overlay with `celebrate` animation preset. Auto-dismisses after 1.5s (correct) or 2.5s (incorrect, with correct answer highlighted). Uses Framer Motion `AnimatePresence` for enter/exit.
- [x] T008 [US1] Implement LogicalSequenceGame component in `src/games/logical-sequence/LogicalSequenceGame.tsx` — implements `GameProps` interface. State: `patterns: PatternInstance[]`, `currentIndex: number`, `correctCount: number`, `selectedOption: string | null`, `showFeedback: boolean`. On mount: call `generateRound(difficulty, roundSize)`. On option select: check if correct, show FeedbackOverlay, call `onCorrectItem()` if correct, auto-advance after feedback delay. When `currentIndex >= roundSize`: call `onRoundComplete({ totalItems: roundSize, correctItems: correctCount })`.

**Checkpoint**: Core gameplay loop works — player can play through 10 patterns with feedback. US2 (scoring/results) is automatically handled by GameShell when `onRoundComplete` is called.

---

## Phase 4: User Story 2 — Round Results and Scoring (Priority: P1)

**Goal**: Player sees score, star rating, and celebration after completing a round

**Independent Test**: Complete a full round → verify results screen shows correct count, star rating (1-3 stars), celebration animation, and play-again option

### Implementation for User Story 2

- [x] T009 [US2] Verify and wire round completion in `src/games/logical-sequence/LogicalSequenceGame.tsx` — ensure `onRoundComplete()` is called with accurate `{ totalItems, correctItems }` matching the `RoundResults` interface from `src/core/registry/types.ts`. GameShell handles the results screen (ScoreDisplay, StarRating, CelebrationAnimation, NewRecordAnimation) and score persistence automatically. No additional implementation needed beyond correct callback invocation. Verify by reviewing that correctCount increments only on correct answers and totalItems equals roundSize.

**Checkpoint**: Full game flow with scoring works — GameShell displays results, persists scores to IndexedDB

---

## Phase 5: User Story 4 — Game Selection from Home (Priority: P1)

**Goal**: Logical Sequence game appears on the home page and launches correctly

**Independent Test**: Navigate to home page → see "Sequência Lógica" game card with icon → tap card → game loads with difficulty selection

### Implementation for User Story 4

- [x] T010 [P] [US4] Create LogicalSequenceIcon component in `src/games/logical-sequence/components/LogicalSequenceIcon.tsx` — renders a representative icon for the game card (e.g., 🔴🔵🔴🔵❓ or a pattern-themed SVG). Accepts `size?: number` prop. Style with design system tokens.
- [x] T011 [P] [US4] Create plugin definition in `src/games/logical-sequence/index.ts` — export `plugin: GamePlugin` with: `id: 'logical-sequence'`, `name: 'Sequência Lógica'`, `description: 'Descubra o padrão e complete a sequência!'`, `icon: LogicalSequenceIcon`, `component: lazy(() => import('./LogicalSequenceGame'))`, `defaultRoundSize: 10`, `difficulties: ['easy', 'medium', 'hard']`, `pointsPerItem: 10`
- [x] T012 [US4] Register game plugin in `src/games/index.ts` — add `import { plugin as logicalSequence } from './logical-sequence'` and `gameRegistry.register(logicalSequence)`

**Checkpoint**: Game is visible on home page, launches into difficulty selection, and full play flow works

---

## Phase 6: User Story 3 — Progressive Difficulty (Priority: P2)

**Goal**: Each difficulty level produces distinctly different pattern types and complexity

**Independent Test**: Select easy → see simple AB-AB patterns with 2 options. Select medium → see ABC cycles or growth with 3 options. Select hard → see nested/complex patterns with 3 options.

### Implementation for User Story 3

- [x] T013 [US3] Validate and refine difficulty-specific pattern rules in `src/games/logical-sequence/logic/pattern-rules.ts` — ensure each difficulty maps to the correct pattern types per FR-006: easy = two-element alternation (AB-AB) with 4-5 visible elements and 2 options; medium = three-element cycles (ABC-ABC) or simple growth with 5-6 visible and 3 options; hard = nested patterns, multi-attribute, or growth with 6-8 visible and 3 options. Verify at least 20 distinct pattern variations per difficulty (SC-006) by combining generators × emoji sets. Add any missing pattern generators (e.g., nested cycle generator for hard difficulty that combines two independent cycles).

**Checkpoint**: All three difficulty levels produce appropriately complex patterns with sufficient variety

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and refinements across all stories

- [x] T014 [P] Run `npm run lint` and fix any lint errors in all new files under `src/games/logical-sequence/`
- [x] T015 [P] Run `npm run build` and verify zero TypeScript compilation errors
- [x] T016 Verify full game flow end-to-end: home page → game card → difficulty selection → play 10 patterns → results screen → play again. Test all three difficulties. Confirm feedback timing (< 500ms per SC-002), emoji rendering, and touch targets (≥ 44px).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — core gameplay
- **US2 (Phase 4)**: Depends on US1 (Phase 3) — needs round completion wiring
- **US4 (Phase 5)**: Depends on US1 (Phase 3) — needs game component to exist for lazy import
- **US3 (Phase 6)**: Depends on Foundational (Phase 2) — refines pattern rules. Can start in parallel with US1 if working on different files.
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **US2 (P1)**: Depends on US1 — needs the game component's `onRoundComplete` wiring
- **US4 (P1)**: Depends on US1 — needs game component for lazy loading, but icon (T010) and plugin definition (T011) can be written in parallel with US1
- **US3 (P2)**: Can start after Foundational (Phase 2) — pattern rule refinement is independent of UI

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- Game component (T008) depends on all three UI components (T005, T006, T007)
- Plugin registration (T012) depends on plugin definition (T011) and icon (T010)

### Parallel Opportunities

- T005, T006, T007 can run in parallel (different component files)
- T010, T011 can run in parallel with US1 component tasks (different files)
- T014, T015 can run in parallel (lint vs build)

---

## Parallel Example: User Story 1

```bash
# Launch all UI components for US1 together:
Task: "T005 [P] [US1] Create PatternDisplay component in src/games/logical-sequence/components/PatternDisplay.tsx"
Task: "T006 [P] [US1] Create OptionButtons component in src/games/logical-sequence/components/OptionButtons.tsx"
Task: "T007 [P] [US1] Create FeedbackOverlay component in src/games/logical-sequence/components/FeedbackOverlay.tsx"

# Then wire them up in the game component:
Task: "T008 [US1] Implement LogicalSequenceGame component in src/games/logical-sequence/LogicalSequenceGame.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (pattern engine)
3. Complete Phase 3: User Story 1 (core gameplay + feedback)
4. **STOP and VALIDATE**: Test gameplay loop independently
5. Add US4 (registration) to make it accessible from home page → playable MVP

### Incremental Delivery

1. Setup + Foundational → Pattern engine ready
2. Add US1 → Core gameplay works → Can test in isolation
3. Add US2 → Scoring verified → Results screen works
4. Add US4 → Game registered → Accessible from home page (MVP!)
5. Add US3 → Difficulty validation → All levels distinct
6. Polish → Lint, build, E2E validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (core gameplay components)
   - Developer B: US4 (icon + plugin definition — can work on T010, T011 without US1)
   - Developer C: US3 (pattern rule refinement — pure logic, no UI)
3. Developer A completes T008 (game component) after US1 components done
4. Developer B completes T012 (registration) after game component exists

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US2 (scoring) is lightweight — GameShell handles results screen, scoring engine, and persistence automatically
- No hint system in this game (unlike emoji-guess) — simplifies implementation
- Pattern generation is pure functions — easily unit-testable if tests are added later
- All emojis are Unicode 9.0 or earlier for broad device support
- Commit after each task or logical group
