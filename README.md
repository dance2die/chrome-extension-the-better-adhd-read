# Better ADHD Read

A browser extension for Chrome and Edge designed to help users (especially those with ADHD) focus on reading by highlighting specific text blocks on click.

## Features

- **Maintain Focus**: Highlight exactly what you are reading to prevent losing your place.
- **Multiple Highlight Modes**:
  - **Sentence (P1)**: Highlights the specific sentence you clicked.
  - **Row (P2)**: Highlights the entire horizontal line of text.
  - **Word/Paragraph (P3)**: Highlights individual words or entire logical blocks (paragraphs, list items).
- **Interactive Toggles**: Toggle highlights on/off by clicking the same text again.
- **Customization**: Adjust highlight color and opacity through the extension popup.
- **Privacy First**: All text processing is done locally in your browser using `Intl.Segmenter`. No data is sent to external servers.

## Prerequisites

- [Bun](https://bun.sh/) (Primary runtime and package manager)
- Chrome or Edge browser (for testing/use)

## Installation

### From `main` branch (stable)
```bash
git clone https://github.com/dance2die/chrome-extension-the-better-adhd-read.git
cd chrome-extension-adhd-read
bun install
bun run build
```

### From a feature branch (experimental)
```bash
git clone https://github.com/dance2die/chrome-extension-the-better-adhd-read.git
cd chrome-extension-adhd-read
git checkout <branch_name>
bun install
bun run build
```

## Loading into Browser

1. Open Chrome or Edge and navigate to the extensions management page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
2. Enable **Developer mode** (usually a toggle in the top-right corner).
3. Click the **Load unpacked** button.
4. Select the `dist/` folder located in the project root.

## Development & Testing

- **Type Check**: `bun run typecheck`
- **Unit Tests**: `bun run test` (Boundary detection logic)
- **E2E Tests**: `bun run test:e2e` (Playwright interactions)

---
*Built with TypeScript and Bun.*
