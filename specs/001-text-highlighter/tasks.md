---
description: "Task list for Text Highlighter Extension implementation"
---

# Tasks: Text Highlighter Extension

**Input**: Design documents from `/specs/001-text-highlighter/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests are MANDATORY for boundary detection logic. E2E tests are MANDATORY for core interaction flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure using Bun

- [ ] T001 Create project structure per implementation plan (src/, tests/)
- [ ] T002 Initialize TypeScript project with Chrome Extension dependencies using Bun (`bun init`)
- [ ] T003 [P] Configure linting (ESLint) and formatting (Prettier) tools
- [ ] T004 [P] Setup Manifest V3 configuration in `src/manifest.json`
- [ ] T005 [P] Configure Playwright for extension E2E testing in `playwright.config.ts`
- [ ] T006 [P] Configure Bun test runner for unit tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for state management and messaging

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Define shared types and interfaces in `src/common/types.ts` (HighlightConfig, HighlightMode)
- [ ] T008 Implement storage wrapper for `chrome.storage.local` in `src/common/storage.ts`
- [ ] T009 [P] Implement background service worker in `src/background/index.ts` (handles storage and messaging)
- [ ] T010 [P] Implement basic popup UI in `src/popup/index.html` and `src/popup/index.tsx` (toggle extension state)
- [ ] T011 [P] Create base CSS variables for highlighting in `src/styles/theme.css`
- [ ] T012 Setup message listener in content script in `src/content/index.ts` to receive `CONFIG_SYNC`

**Checkpoint**: Foundation ready - basic extension toggling works, communication bridge is active.

---

## Phase 3: User Story 1 - Highlight Active Sentence (Priority: P1) 🎯 MVP

**Goal**: Highlight a sentence when the user clicks on it.

**Independent Test**: Load extension, navigate to a page, click a sentence. Verify it is highlighted with default yellow background.

### Tests for User Story 1 (MANDATORY) ⚠️

- [ ] T013 [P] [US1] Unit test for sentence boundary detection logic using Bun test in `tests/unit/boundary.test.ts`
- [ ] T014 [US1] Playwright E2E test for click-to-highlight sentence in `tests/e2e/sentence.spec.ts`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement sentence boundary detection using `Intl.Segmenter` in `src/content/segmenter.ts`
- [ ] T016 [US1] Implement click event listener in content script `src/content/index.ts` to identify clicked text node
- [ ] T017 [US1] Implement text wrapping logic to apply highlight `<span>` in `src/content/highlighter.ts`
- [ ] T018 [US1] Add highlight styles for `.ext-highlighter-active` in `src/styles/highlighter.css`
- [ ] T019 [US1] Ensure previous highlights are cleared before applying new ones in `src/content/highlighter.ts`
- [ ] T020 [US1] Implement toggle-off logic: Clicking an active highlight clears it (FR-009) in `src/content/highlighter.ts`
- [ ] T021 [US1] Implement clear-on-navigation logic: Remove highlights on `beforeunload` or URL change (FR-007) in `src/content/index.ts`
- [ ] T022 [US1] Verify Performance: Ensure highlight application takes < 16ms in `src/content/highlighter.ts`

**Checkpoint**: MVP Ready - Sentence highlighting on click is fully functional and tested.

---

## Phase 4: User Story 2 - Highlight Entire Row (Priority: P2)

**Goal**: Highlight the entire horizontal line where the user clicks.

**Independent Test**: Select "Row" mode in popup. Click a line of text. Verify a horizontal highlight bar covers the width of the text container.

### Tests for User Story 2 (MANDATORY) ⚠️

- [ ] T023 [US2] E2E test for Row highlight positioning and dimensions in `tests/e2e/row.spec.ts`

### Implementation for User Story 2

- [ ] T024 [P] [US2] Add "Row" option to popup UI in `src/popup/index.tsx`
- [ ] T025 [US2] Implement row detection (calculating line height and bounding box) in `src/content/segmenter.ts`
- [ ] T026 [US2] Implement overlay `<div>` rendering for row highlighting in `src/content/highlighter.ts`
- [ ] T027 [US2] Add styling for row overlay in `src/styles/highlighter.css` (pointer-events: none)

**Checkpoint**: Row Highlighting Ready - Users can now use horizontal guide mode.

---

## Phase 5: User Story 3 - Toggle Highlight Granularity (Priority: P3)

**Goal**: Allow users to switch between Word and Paragraph modes via the popup.

**Independent Test**: Use popup to change mode to "Word". Click a word on a page and verify only that word highlights.

### Tests for User Story 3 (MANDATORY) ⚠️

- [ ] T028 [P] [US3] Unit test for Word and Paragraph boundary detection in `tests/unit/boundary.test.ts`
- [ ] T029 [US3] E2E test for switching modes and verifying highlight granularity in `tests/e2e/granularity.spec.ts`

### Implementation for User Story 3

- [ ] T030 [P] [US3] Update popup UI `src/popup/index.tsx` with dropdown/radio for Word and Paragraph modes
- [ ] T031 [US3] Update content script `src/content/index.ts` to respect `activeMode` from `HighlightConfig`
- [ ] T032 [US3] Implement word-level segmentation in `src/content/segmenter.ts`
- [ ] T033 [US3] Implement paragraph detection (finding nearest block element) in `src/content/segmenter.ts`
- [ ] T034 [US3] Refactor `src/content/highlighter.ts` to handle different granularity levels

**Checkpoint**: Granularity Control Ready - User can now precisely control focus level for words and logical blocks.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and quality assurance

- [ ] T035 [P] Implement highlight color/opacity customization in popup `src/popup/index.tsx`
- [ ] T036 [P] Implement "Clear All Highlights" button in popup
- [ ] T037 [P] Optimize bundle size using `Bun.build` minification
- [ ] T038 Perform accessibility audit (contrast ratios for highlights)
- [ ] T039 [P] Verify Privacy: Audit network tab to ensure zero external trackers or data egress (NFR-004)
- [ ] T040 [P] Verify Compatibility: Smoke test extension on top 50 text-heavy domains (SC-004)
- [ ] T041 Final regression run of all E2E tests

---

## Dependencies & Execution Order

1. **Phase 1 (Setup)**: Mandatory first step.
2. **Phase 2 (Foundational)**: MUST be complete before US1, US2, or US3.
3. **Phase 3 (US1 - MVP)**: Highest priority. Can be delivered as an MVP.
4. **Phase 4 (US2)** & **Phase 5 (US3)**: Dependent on Phase 2 & 3 (logic patterns).
5. **Phase 6 (Polish)**: Final cleanup.

## Parallel Opportunities

- T003, T004, T005, T006 (Setup configs)
- T009, T010, T011 (Independent foundational layers)
- T024, T030, T032, T033 (Granularity/Mode UI and logic can be worked in parallel)

## Implementation Strategy

1. **Branch Strategy**: Create a separate feature branch for each phase (e.g., `feat/phase1-setup`, `feat/phase3-us1`).
2. **MVP First**: Deliver User Story 1 (Sentence highlighting) as quickly as possible.
3. **Incremental**: Add Row highlighting (P2) next as it provides a distinct reading guide.
4. **Refine**: Add Word/Paragraph granularity (P3) and UI customizations last.
