import type { ExtensionMessage, HighlightConfig } from '../common/types';
import { DEFAULT_CONFIG } from '../common/types';
import { getSentenceBoundaries, getRowBoundaries, getWordBoundaries, getParagraphBoundaries } from './segmenter';
import { applyHighlight, clearHighlight, isAlreadyHighlighted, applyRowHighlight } from './highlighter';
import { storage } from '../common/storage';

console.log('📖 Better ADHD Read: Content script loading...');

// Global state for the content script
let currentConfig: HighlightConfig = DEFAULT_CONFIG;

// Export for testing purposes
if (typeof window !== 'undefined') {
  (window as any).__ADHD_READ_CONFIG__ = (config: HighlightConfig) => {
    console.log('📖 Better ADHD Read: Test config injected:', config);
    currentConfig = config;
    updateStyles(config);
  };
}

/**
 * Determines the final highlight color based on the config and current theme.
 */
export function getEffectiveColor(config: HighlightConfig): string {
  if (config.themeMode === 'light') return config.lightColor;
  if (config.themeMode === 'dark') return config.darkColor;

  // 'system' mode
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkMode ? config.darkColor : config.lightColor;
}

/**
 * Updates the CSS variables used for highlighting.
 */
function updateStyles(config: HighlightConfig) {
  const root = document.documentElement;
  const activeColor = getEffectiveColor(config);
  root.style.setProperty('--ext-highlighter-bg-color', activeColor);
  root.style.setProperty('--ext-highlighter-bg-opacity', config.opacity.toString());
}

// Initialize by fetching the current config from storage
storage.getConfig().then((config) => {
  currentConfig = config;
  updateStyles(config);
  console.log('📖 Better ADHD Read: Content script initialized with config:', config);
});

// Listen for system color scheme changes if in 'system' mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentConfig.themeMode === 'system') {
    updateStyles(currentConfig);
  }
});

// Listen for messages from the background script
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message: any) => {
    if (message.type === 'CONFIG_SYNC') {
      console.log('📖 Better ADHD Read: Received updated config:', message.payload);
      currentConfig = message.payload;
      updateStyles(currentConfig);

      if (!currentConfig.isEnabled) {
        clearHighlight();
      }
    } else if (message.type === 'CLEAR_HIGHLIGHTS') {
      console.log('📖 Better ADHD Read: Clearing highlights.');
      clearHighlight();
    }
  });
}

// Clear highlight when user navigates away or refreshes
window.addEventListener('beforeunload', () => {
  clearHighlight();
});

// Handle clicks for highlighting text
document.addEventListener('click', (event: MouseEvent) => {
  console.log('📖 Better ADHD Read: Click detected', {
    isEnabled: currentConfig.isEnabled,
    mode: currentConfig.activeMode,
    target: event.target
  });

  if (!currentConfig.isEnabled) {
    return;
  }

  const targetElement = event.target as HTMLElement;
  if (!targetElement) return;

  if (isAlreadyHighlighted(targetElement)) {
    console.log('📖 Better ADHD Read: Toggling off highlight');
    clearHighlight();
    event.stopPropagation();
    return;
  }

  // BUG #2 FIX: Don't interfere with native text selection (user dragging to copy)
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    return;
  }

  // BUG #1 FIX: Clear any existing highlight BEFORE obtaining the text node reference
  // so that parent.normalize() doesn't invalidate the node we get below
  clearHighlight();

  let range: Range | null = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  }

  if (!range) {
    console.log('📖 Better ADHD Read: No text range found at click point');
    return;
  }

  const textNode = range.startContainer;
  if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) {
    console.log('📖 Better ADHD Read: Click target is not a text node');
    return;
  }

  const t0 = performance.now();

  if (currentConfig.activeMode === 'sentence') {
    const boundary = getSentenceBoundaries(textNode.textContent, range.startOffset);
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      selectionCleanup();
    }
  } else if (currentConfig.activeMode === 'word') {
    const boundary = getWordBoundaries(textNode.textContent, range.startOffset);
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      selectionCleanup();
    }
  } else if (currentConfig.activeMode === 'paragraph') {
    const boundary = getParagraphBoundaries(textNode.textContent, range.startOffset);
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      selectionCleanup();
    }
  } else if (currentConfig.activeMode === 'row') {
    const boundary = getRowBoundaries(range);
    if (boundary) {
      applyRowHighlight(targetElement, boundary);
      selectionCleanup();
    }
  }

  const t1 = performance.now();
  if (t1 - t0 > 16) {
    console.warn(`📖 Better ADHD Read: Highlight took ${t1 - t0}ms`);
  }
});

function selectionCleanup() {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
}
