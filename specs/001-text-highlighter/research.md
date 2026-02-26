# Research: Text Highlighter Extension

## Bun as Bundler & Package Manager

- **Decision**: Use `Bun.build` for bundling the extension.
- **Rationale**: Bun provides a high-performance bundler that natively supports TypeScript and can output to multiple files (background, content, popup) required for Manifest V3.
- **Alternatives considered**: Vite/Webpack (more complex configuration), Rollup.

## Unit Testing with `bun test`

- **Decision**: Use `bun:test` with global mocks for `chrome.*` APIs.
- **Rationale**: extremely fast execution and built-in mocking capabilities.
- **Mocking Strategy**:
  ```typescript
  global.chrome = {
    storage: { local: { get: mock(...), set: mock(...) } }
  } as any;
  ```

## Sentence & Word Boundary Detection

- **Decision**: Use `Intl.Segmenter` (granularity: 'sentence' or 'word').
- **Rationale**: Part of the ECMAScript standard, locale-aware, and handles complex edge cases (abbreviations, punctuation) natively.
- **Implementation**: `new Intl.Segmenter(lang, { granularity: 'sentence' })`.

## Row Highlighting (Non-Table)

- **Decision**: Calculate the bounding box of the target word/sentence and create a full-width visual overlay or apply a `line-height` based highlight class.
- **Rationale**: Provides a consistent "row" experience even in standard paragraphs.
- **Alternatives considered**: `::selection` (unreliable for custom styling).

## Manifest V3 Compatibility

- **Decision**: Use Service Workers for background logic and surgical DOM updates via `TreeWalker` to maintain performance (LCP).
- **Rationale**: Required for modern extensions and ensures minimal performance overhead.
