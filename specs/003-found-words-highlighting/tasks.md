# Tasks: Found Words Highlighting

**Input**: Design documents from `/specs/003-found-words-highlighting/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed — all changes are modifications to existing files. This phase is empty.

*(No tasks — existing project structure is sufficient)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational/blocking work needed — both user stories are independent modifications to separate game modules with no shared prerequisites.

*(No tasks — both stories can begin immediately)*

---

## Phase 3: User Story 1 — Word Search Multi-Color Highlighting (Priority: P1) 🎯 MVP

**Goal**: Each found word in Word Search is highlighted with a distinct color from the `wordHighlightColors` palette, and the word list displays per-word color indicators.

**Independent Test**: Find 3+ words in a Word Search game and verify each word displays in a unique color in both the grid and the word list.

### Implementation for User Story 1

- [ ] T001 [US1] Add `foundWordColors: Map<string, number>` state and import `wordHighlightColors` in `src/games/word-search/WordSearchGame.tsx` — initialize as empty Map, assign `colorIndex = foundWordColors.size % wordHighlightColors.length` when a word is found in `handlePointerUp`
- [ ] T002 [US1] Build `cellColorMap: Map<string, number>` at render time in `src/games/word-search/WordSearchGame.tsx` — iterate `placedWords` filtered by `foundWords`, map each cell to its word's `colorIndex` (later found words overwrite at intersections), replace single-green `foundCells` background with palette color lookup using `wordHighlightColors[colorIndex]`
- [ ] T003 [US1] Update grid cell rendering in `src/games/word-search/WordSearchGame.tsx` — replace `colors.success` background/text color for found cells with the per-cell color from `cellColorMap`, using `wordHighlightColors[colorIndex]` for background (with alpha) and a darkened variant or `colors.textPrimary` for text
- [ ] T004 [US1] Pass `foundWordColors` prop to `WordList` component in `src/games/word-search/WordSearchGame.tsx`
- [ ] T005 [US1] Update `WordList` component in `src/games/word-search/components/WordList.tsx` — add `foundWordColors: Map<string, number>` prop, import `wordHighlightColors` from design-system tokens, for found words use `wordHighlightColors[colorIndex]` as background color instead of fixed `${colors.success}20`

**Checkpoint**: Word Search displays each found word in a unique color in both grid and word list. Colors cycle when exceeding palette size. Intersecting cells show the most recently found word's color.

---

## Phase 4: User Story 2 — Crossword Uniform Highlighting (Priority: P2)

**Goal**: All completed words in Crossword are highlighted with a single uniform completion color instead of per-word colors.

**Independent Test**: Complete 3+ words in a Crossword game and verify all completed cells share the same green highlight color.

### Implementation for User Story 2

- [ ] T006 [P] [US2] Remove `colorIndex` from `CompletedWordInfo` interface in `src/games/crossword/CrosswordGame.tsx` — keep only `completedOrder: number`
- [ ] T007 [US2] Simplify `handleWordCompletion` in `src/games/crossword/CrosswordGame.tsx` — remove `colorIndex: (newCompleted.size) % 10` assignment when creating new `CompletedWordInfo` entries
- [ ] T008 [P] [US2] Update `CrosswordGrid` component in `src/games/crossword/components/CrosswordGrid.tsx` — remove `wordHighlightColors` import, remove `CompletedWordInfo.colorIndex` usage, replace `wordHighlightColors[completedInfo.colorIndex]` with `${colors.success}30` for all completed cell backgrounds
- [ ] T009 [US2] Update `CompletedWordInfo` type in `CrosswordGrid.tsx` props interface to match simplified type (remove `colorIndex` field) in `src/games/crossword/components/CrosswordGrid.tsx`
- [ ] T010 [US2] Update `ClueList` component prop type in `src/games/crossword/components/ClueList.tsx` — update `completedWords` type to `Map<string, { completedOrder: number }>` (remove `colorIndex` from inline type)

**Checkpoint**: All completed Crossword cells display the same uniform green highlight. No per-word color tracking remains.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across both games

- [ ] T011 Run `npm run build` to verify TypeScript compilation with zero errors
- [ ] T012 Run `npm run lint` to verify ESLint passes with zero warnings
- [ ] T013 Run `npm run test` to verify all existing tests pass
- [ ] T014 Run quickstart.md manual verification — play both games and confirm highlighting behavior

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Empty — no setup needed
- **Phase 2 (Foundational)**: Empty — no blocking prerequisites
- **Phase 3 (US1 — Word Search)**: Can start immediately
- **Phase 4 (US2 — Crossword)**: Can start immediately, independent of Phase 3
- **Phase 5 (Polish)**: Depends on Phases 3 and 4 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — modifies Word Search files only
- **User Story 2 (P2)**: No dependencies on other stories — modifies Crossword files only

### Within Each User Story

- **US1**: T001 → T002 → T003 → T004 → T005 (sequential — same file then dependent component)
- **US2**: T006 and T008 can run in parallel [P]; T007 depends on T006; T009 depends on T008; T010 can run in parallel with T008/T009

### Parallel Opportunities

**Cross-story parallelism**: US1 and US2 operate on completely separate files — they can be implemented simultaneously.

```text
# Parallel execution — both stories at once:
Stream A (Word Search):  T001 → T002 → T003 → T004 → T005
Stream B (Crossword):    T006 + T008 → T007 + T009 + T010

# Then: T011 → T012 → T013 → T014
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: Word Search Multi-Color Highlighting (T001–T005)
2. **STOP and VALIDATE**: Play Word Search, verify per-word colors
3. Deploy/demo if ready — Word Search improvement delivers standalone value

### Incremental Delivery

1. Add User Story 1 (Word Search) → Test independently → Value delivered
2. Add User Story 2 (Crossword) → Test independently → Value delivered
3. Polish phase → Full verification → Feature complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are fully independent — different game modules, zero shared code changes
- No new files created — all tasks modify existing files
- Commit after each task or logical group
