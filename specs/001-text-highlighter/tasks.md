---

description: "Task list for updating README documentation"
---

# Tasks: Update README Documentation

**Input**: Design documents from `/specs/001-text-highlighter/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), quickstart.md

**Organization**: Tasks are grouped by phase and user story to enable independent verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Information Gathering)

**Purpose**: Collect data needed for documentation

- [x] T001 [P] Extract remote repository URL from git config for use in installation steps

---

## Phase 2: User Story 1 - Project Overview (Priority: P1)

**Goal**: Provide a professional description and feature summary in the README.

**Independent Test**: Verify that the README contains a clear "Features" section describing P1, P2, and P3 capabilities.

### Implementation for User Story 1

- [x] T002 [US1] Add professional project description and feature list to `README.md`
- [x] T003 [P] [US1] Add project prerequisites (Bun, Chrome/Edge) to `README.md`

---

## Phase 3: User Story 2 - Installation Instructions (Priority: P2)

**Goal**: Add clear installation and build steps using Bun.

**Independent Test**: Run the installation and build commands listed in the README to ensure they work as documented.

### Implementation for User Story 2

- [x] T004 [US2] Add clear installation and build steps (clone, install, build) using Bun to `README.md`
- [x] T005 [P] [US2] Add development and test execution commands (typecheck, test, test:e2e) to `README.md`

---

## Phase 4: User Story 3 - Loading Instructions (Priority: P3)

**Goal**: Explain how to load the extension into Chrome/Edge for both main and feature branches.

**Independent Test**: Verify the README explains how to use "Load unpacked" and provides branch-specific context.

### Implementation for User Story 3

- [x] T006 [US3] Add detailed instructions for loading the extension in Chrome/Edge via `chrome://extensions/` to `README.md`
- [x] T007 [P] [US3] Include specific context for loading from `main` or specific `<branch_name>` in `README.md`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification

- [x] T008 Perform a final visual audit of the rendered `README.md` for formatting and link correctness

---

## Dependencies & Execution Order

1. **Setup (Phase 1)**: Must run first to get the URL.
2. **Implementation (Phases 2-4)**: Can proceed in any order, but P1 is the logical starting point.
3. **Polish (Phase 5)**: Final step after all content is added.

## Parallel Opportunities

- T003, T005, and T007 can be drafted in parallel once the main structure is set.

## Implementation Strategy

- **Incremental Delivery**: Update sections one by one, ensuring accuracy of commands.
