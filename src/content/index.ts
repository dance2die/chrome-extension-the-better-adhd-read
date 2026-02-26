import type { ExtensionMessage, HighlightConfig } from '../common/types';
import { DEFAULT_CONFIG } from '../common/types';
import { getSentenceBoundaries, getRowBoundaries, getWordBoundaries, getParagraphBoundaries } from './segmenter';
import { applyHighlight, clearHighlight, isAlreadyHighlighted, applyRowHighlight } from './highlighter';

// Global state for the content script
let currentConfig: HighlightConfig = DEFAULT_CONFIG;

// Export for testing purposes
if (typeof window !== 'undefined') {
  (window as any).__ADHD_READ_CONFIG__ = (config: HighlightConfig) => {
    currentConfig = config;
    updateStyles(config);
  };
}

/**
 * Updates the CSS variables used for highlighting.
 */
function updateStyles(config: HighlightConfig) {
  const root = document.documentElement;
  // Convert hex color to rgba if needed or just use the color + opacity
  // For simplicity, we'll assume the user picked a solid color and we apply the opacity via CSS
  root.style.setProperty('--ext-highlighter-bg-color', config.color);
  root.style.setProperty('--ext-highlighter-bg-opacity', config.opacity.toString());
  
  // Construct the full background variable
  // If config.color is #ffff00 and config.opacity is 0.5, we want rgba(255, 255, 0, 0.5)
  // But CSS handles this easily if we use a helper or separate vars.
}

// Initialize by fetching the current config from storage
import { storage } from '../common/storage';
storage.getConfig().then((config) => {
  currentConfig = config;
  updateStyles(config);
  console.log('ADHD Read Highlighter content script initialized with config:', config);
});

// Listen for messages from the background script
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message: any) => {
    if (message.type === 'CONFIG_SYNC') {
      console.log('Received updated config:', message.payload);
      currentConfig = message.payload;
      updateStyles(currentConfig);
      
      // Clear highlight if extension is disabled
      if (!currentConfig.isEnabled) {
        clearHighlight();
      }
    } else if (message.type === 'CLEAR_HIGHLIGHTS') {
      clearHighlight();
    }
  });
}

// Clear highlight when user navigates away or refreshes (FR-007)
window.addEventListener('beforeunload', () => {
  clearHighlight();
});

// Handle clicks for highlighting text
document.addEventListener('click', (event: MouseEvent) => {
  if (!currentConfig.isEnabled) {
    return;
  }

  // Ensure click is on an element
  const targetElement = event.target as HTMLElement;
  if (!targetElement) return;

  // Toggle off logic: if clicking the active highlight, clear it and stop (FR-009)
  if (isAlreadyHighlighted(targetElement)) {
    clearHighlight();
    // Stop propagation so we don't accidentally highlight parent text
    event.stopPropagation(); 
    return;
  }

  // Find the exact text node the user clicked on
  let range: Range | null = null;
  
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if ((document as any).caretPositionFromPoint) {
    // Firefox fallback
    const pos = (document as any).caretPositionFromPoint(event.clientX, event.clientY);
    if (pos) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }

  if (!range) return;

  const textNode = range.startContainer;

  // Ensure it's actually a text node
  if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) {
    return;
  }

  // Only apply sentence highlighting if that mode is active
  if (currentConfig.activeMode === 'sentence') {
    const t0 = performance.now();
    
    const offset = range.startOffset;
    const boundary = getSentenceBoundaries(textNode.textContent, offset);
    
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      
      const t1 = performance.now();
      if (t1 - t0 > 16) {
        console.warn(`Highlight application missed 60fps target. Took ${t1 - t0}ms`);
      }
      
      // Clear selection so the user doesn't see browser highlight over our custom highlight
      selection.removeAllRanges();
    }
  } else if (currentConfig.activeMode === 'word') {
    const boundary = getWordBoundaries(textNode.textContent, range.startOffset);
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      selection.removeAllRanges();
    }
  } else if (currentConfig.activeMode === 'paragraph') {
    const boundary = getParagraphBoundaries(textNode.textContent, range.startOffset);
    if (boundary) {
      applyHighlight(textNode as Text, boundary);
      selection.removeAllRanges();
    }
  } else if (currentConfig.activeMode === 'row') {
    const t0 = performance.now();
    
    const boundary = getRowBoundaries(range);
    if (boundary) {
      applyRowHighlight(targetElement, boundary);
      
      const t1 = performance.now();
      if (t1 - t0 > 16) {
        console.warn(`Row highlight application missed 60fps target. Took ${t1 - t0}ms`);
      }
      
      selection.removeAllRanges();
    }
  }
});
