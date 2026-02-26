# Feature Specification: Text Highlighter Extension

**Feature Branch**: `001-text-highlighter`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "Chrome/Edge extension to highlight a sentence in website text. optionally highlight words, paragraph, row"

## Clarifications

### Session 2026-02-25
- Q: When "Row" mode is active, how should the highlight be triggered? → A: Clicking anywhere on a horizontal line triggers the row highlight.
- Q: How should the system define a "paragraph" boundary for highlighting? → A: Any block-level container (`<p>`, `<div>`, `<li>`, etc.) is treated as a paragraph.
- Q: Should a highlight persist if the user navigates to a new page or refreshes? → A: Clear active highlight on page navigation or refresh.
- Q: Should the user be able to highlight multiple items simultaneously? → A: Single active highlight only (clicking new clears old).
- Q: How should a user manually clear the active highlight? → A: Toggle: Clicking the active highlight clears it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Highlight Active Sentence (Priority: P1)

As a reader with ADHD, I want the extension to highlight the current sentence I am reading so that I can maintain my focus and not lose my place in the text.

**Why this priority**: This is the core functionality that provides immediate value for focus and readability.

**Independent Test**: Can be tested by navigating to any text-heavy webpage, activating the extension, and verifying that the sentence clicked is visually highlighted.

**Acceptance Scenarios**:

1. **Given** a webpage with multiple sentences, **When** I click on a sentence, **Then** that sentence should be visually highlighted with a default background color.
2. **Given** a highlighted sentence, **When** I click on a different sentence, **Then** the previous highlight should be removed and the new sentence should be highlighted.
3. **Given** a highlighted sentence, **When** I click on that same sentence again, **Then** the highlight should be removed.

---

### User Story 2 - Highlight Entire Row (Priority: P2)

As a user, I want an option to highlight the entire horizontal row (line) of text where my cursor is located, regardless of sentence boundaries, to provide a consistent visual guide across the page.

**Why this priority**: Useful for scanning lists or structured data where sentence-based highlighting might be erratic. Highly prioritized for accessibility and scanning.

**Independent Test**: Can be tested by selecting "Row" mode and verifying a full-width highlight appears on click.

**Acceptance Scenarios**:

1. **Given** "Row" mode is active, **When** I click anywhere on a horizontal line, **Then** a horizontal highlight bar should appear at that vertical position across the width of the container.

---

### User Story 3 - Toggle Highlight Granularity (Priority: P3)

As a user, I want to optionally switch between highlighting words, sentences, or entire paragraphs so that I can adjust the focus level based on the content complexity.

**Why this priority**: Provides flexibility for different reading needs and content types.

**Independent Test**: Can be tested by using a keyboard shortcut or popup menu to change the "highlight mode" and verifying the change in visual behavior on the page.

**Acceptance Scenarios**:

1. **Given** the extension is active, **When** I select "Word" mode, **Then** only the individual word under the cursor should be highlighted on click.
2. **Given** the extension is active, **When** I select "Paragraph" mode, **Then** the entire containing block-level element (e.g., `<p>`, `<div>`, `<li>`) should be highlighted on click.

### Edge Cases

- **Non-textual elements**: How does the system handle images, videos, or code blocks? (Assumption: These will be ignored or the nearest text node will be targeted).
- **Dynamic content**: How are highlights handled on pages with auto-refreshing content (e.g., social media feeds)? (Assumption: Re-evaluate on DOM change).
- **Nested elements**: Handling text within complex nested spans or buttons.
- **Page Navigation**: Highlights are transient and do not persist across page loads or URL changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST detect the sentence boundary correctly based on standard punctuation (., !, ?).
- **FR-002**: System MUST provide a popup interface to toggle between highlight modes: Word, Sentence, Paragraph, and Row.
- **FR-003**: System MUST allow users to customize the highlight color and opacity.
- **FR-004**: System MUST include a global toggle to enable/disable the extension quickly.
- **FR-005**: System MUST trigger the highlight when the user clicks on a target text element (sentence, word, paragraph, or row). For Row mode, clicking anywhere on the horizontal line activates the guide.
- **FR-006**: Paragraph detection MUST target the nearest block-level container (e.g., `<p>`, `<div>`, `<li>`, `<article>`).
- **FR-007**: System MUST clear active highlights upon page refresh or navigation to a different URL.
- **FR-008**: System MUST support ONLY ONE active highlight at a time; clicking a new target MUST automatically clear the previous highlight.
- **FR-009**: System MUST toggle the highlight state if the user clicks on an already highlighted element (clear highlight on second click).

### Non-Functional & Compliance Requirements

- **NFR-001**: MUST adhere to Chrome Extension Manifest V3.
- **NFR-002**: MUST be implemented in TypeScript (MANDATORY). JavaScript is NOT permitted.
- **NFR-003**: MUST use Bun (MANDATORY) for development, testing, and building.
- **NFR-004**: MUST NOT use external trackers; all data processing MUST be local.
- **NFR-005**: Performance: Content injection MUST NOT degrade page load speed (LCP).
- **NFR-006**: MUST use feature branches for development. `main` branch MUST NOT be modified directly.
- **NFR-007**: Branch names and commit messages MUST follow Conventional Commits (e.g., feat/, fix/).

### Key Entities

- **HighlightConfig**: User preferences including active mode, color, and global state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Extension initializes and starts highlighting within 200ms of page load completion.
- **SC-002**: Highlight follows cursor movement with no visible lag (under 16ms/60fps).
- **SC-003**: Users can change the highlight mode via the popup in under 3 clicks.
- **SC-004**: System works correctly on 95% of top 100 most visited websites.

## Assumptions

- **A-001**: Highlight color defaults to a light yellow with 50% opacity.
- **A-002**: "Sentence" mode is the default active mode upon installation.
- **A-003**: The extension will use `chrome.storage.local` to persist user configurations.
