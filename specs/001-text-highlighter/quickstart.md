# Quickstart: Text Highlighter Extension (Bun)

## Prerequisites

- [Bun](https://bun.sh/) (MANDATORY package manager and runtime)
- Chrome or Edge browser (for testing)

## Development Setup

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Build the extension**:
   ```bash
   bun build ./src/background.ts ./src/content.ts ./src/popup.ts --outdir ./dist
   ```
   *Tip: Add `--watch` to auto-rebuild during development.*

## Loading the Extension

1. Open `chrome://extensions/` or `edge://extensions/`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select the `dist/` folder in the project root.

## Testing

### Unit tests (Logic, Boundary Detection)
```bash
bun test
```

### E2E tests (Interaction, Multi-tab syncing)
```bash
bun test:e2e # Uses Playwright
```
