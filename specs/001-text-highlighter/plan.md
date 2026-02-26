# Implementation Plan: Text Highlighter Extension

**Branch**: `001-text-highlighter` | **Date**: 2026-02-25 | **Spec**: [/specs/001-text-highlighter/spec.md](/specs/001-text-highlighter/spec.md)
**Input**: Feature specification from `/specs/001-text-highlighter/spec.md`

## Summary

This iteration of the Text Highlighter extension prioritizes "Row Mode" as P2 and "Highlight Granularity" as P3. It implements a distraction-free reading aid for Chrome/Edge that allows users to highlight sentences (P1), rows (P2), or words/paragraphs (P3) via click-to-focus.

## Technical Context

**Language/Version**: TypeScript (MANDATORY), Bun (MANDATORY)  
**Primary Dependencies**: Chrome Extension APIs (Manifest V3), `Intl.Segmenter`  
**Storage**: `chrome.storage.local` for user preferences  
**Testing**: Bun test (MANDATORY), Playwright (E2E)  
**Target Platform**: Chrome, Edge (Manifest V3)
**Project Type**: Browser Extension  
**Performance Goals**: <200ms initialization, 60fps interaction smoothness  
**Constraints**: Privacy-first (local-only), Bun mandatory for dev/build  
**Scale/Scope**: Content script injection on all matched URLs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Does the design use Bun and mandate TypeScript?
- [x] **II. Testing Standards**: Are Bun unit tests and Playwright test strategies defined?
- [x] **III. User Experience Consistency**: Does the UI ensure distraction-free interactions?
- [x] **IV. Performance Requirements**: Will the change meet LCP and injection speed targets?
- [x] **V. Git Workflow & Conventional Commits**: Is the branch using conventional naming and commit strategy?

## Project Structure

### Documentation (this feature)

```text
specs/001-text-highlighter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── background/          # State management and messaging
├── content/             # DOM detection, Segmenter, Highlighting logic
├── popup/               # Mode toggles and customization UI
├── common/              # Shared types and storage wrappers
└── styles/              # Highlighting CSS

tests/
├── unit/                # Boundary detection tests (Bun test)
└── e2e/                 # UX interaction tests (Playwright)
```

**Structure Decision**: Option 1: Single project structure for browser extension artifacts.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
