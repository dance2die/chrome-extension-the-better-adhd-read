import type { HighlightConfig } from '../common/types';
import { DEFAULT_CONFIG } from '../common/types';
import { getSentenceBoundaries, getRowBoundaries, getWordBoundaries, getParagraphBoundaries } from './segmenter';
import { applyHighlight, clearHighlight, isAlreadyHighlighted, applyRowHighlight } from './highlighter';
import { storage } from '../common/storage';
import { getEffectiveColor } from '../common/theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

console.log('📖 Better ADHD Read: Content script loading...');

// Global state for the content script
let currentConfig: HighlightConfig = DEFAULT_CONFIG;

// Export for testing purposes
if (typeof window !== 'undefined') {
  (window as unknown as { __ADHD_READ_CONFIG__: (config: HighlightConfig) => void }).__ADHD_READ_CONFIG__ = (config: HighlightConfig) => {
    console.log('📖 Better ADHD Read: Test config injected:', config);
    currentConfig = config;
    updateStyles(config);
  };
}

/**
 * Determines the final highlight color based on the config and current theme.
 */

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
  chrome.runtime.onMessage.addListener((message: unknown) => {
    const msg = message as { type: string; payload?: HighlightConfig };
    if (msg.type === 'CONFIG_SYNC' && msg.payload) {
      console.log('📖 Better ADHD Read: Received updated config:', msg.payload);
      currentConfig = msg.payload;
      updateStyles(currentConfig);

      if (!currentConfig.isEnabled) {
        clearHighlight();
      }
    } else if (msg.type === 'CLEAR_HIGHLIGHTS') {
      console.log('📖 Better ADHD Read: Clearing highlights.');
      clearHighlight();
    }
  });
}

// Clear highlight when user navigates away or refreshes
window.addEventListener('beforeunload', () => {
  clearHighlight();
});

function handleHighlightEvent(clientX: number, clientY: number, targetElement: HTMLElement, isTriggerClick: boolean): void {
  if (!currentConfig.isEnabled) return;
  if (!targetElement) return;

  if (isTriggerClick && isAlreadyHighlighted(targetElement)) {
    console.log('📖 Better ADHD Read: Toggling off highlight');
    clearHighlight();
    return;
  }

  // BUG #2 FIX: Don't interfere with native text selection (user dragging to copy)
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) return;

  // BUG #1 FIX: Clear any existing highlight BEFORE obtaining the text node reference
  clearHighlight();

  let range: Range | null = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(clientX, clientY);
  }

  if (!range) return;

  const textNode = range.startContainer;
  if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) return;

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
    const boundary = getParagraphBoundaries(textNode.textContent);
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      selectionCleanup();
    }
  } else if (currentConfig.activeMode === 'row') {
    const boundary = getRowBoundaries(range);
    if (boundary) {
      const parentRect = targetElement.getBoundingClientRect();
      boundary.left = parentRect.left;
      boundary.width = parentRect.width;
      applyRowHighlight(targetElement, boundary);
      selectionCleanup();
    }
  }

  const t1 = performance.now();
  if (t1 - t0 > 16) {
    console.warn(`📖 Better ADHD Read: Highlight took ${t1 - t0}ms`);
  }
}

// Handle clicks for highlighting text
document.addEventListener('click', (event: MouseEvent) => {
  if (currentConfig.triggerMode !== 'click') return;

  console.log('📖 Better ADHD Read: Click detected', {
    isEnabled: currentConfig.isEnabled,
    mode: currentConfig.activeMode,
    target: event.target
  });

  handleHighlightEvent(event.clientX, event.clientY, event.target as HTMLElement, true);
});

// Handle hover for highlighting text (debounced)
const HOVER_DEBOUNCE_MS = 50;

document.addEventListener('mousemove', debounce((event: MouseEvent) => {
  if (currentConfig.triggerMode !== 'hover') return;
  handleHighlightEvent(event.clientX, event.clientY, event.target as HTMLElement, false);
}, HOVER_DEBOUNCE_MS));

function selectionCleanup() {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
}
