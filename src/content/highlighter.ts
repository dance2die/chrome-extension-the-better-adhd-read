import type { HighlightState, TextBoundary } from '../common/types';
import type { RowBoundary } from './segmenter';

// Store the currently active highlight
let currentState: HighlightState = { target: null, originalStyle: null, range: null };
let activeRowOverlay: HTMLDivElement | null = null;

/**
 * Wraps the given text node boundary in a highlight span.
 */
export function applyHighlight(textNode: Text, boundary: TextBoundary): void {
  // 1. Create the highlight wrapper element
  const span = document.createElement('span');
  span.className = 'ext-highlighter-active';

  // 3. Extract the text based on the boundary
  // Note: Range is more robust for DOM manipulation than string replacement
  const range = document.createRange();
  try {
    range.setStart(textNode, boundary.start);
    range.setEnd(textNode, boundary.end);

    // Surround the contents with our span
    range.surroundContents(span);

    // Update state
    currentState = {
      target: span,
      originalStyle: null, // Not needed for range wrapping, but good for row/block modes
      range: range
    };
  } catch (e) {
    console.error('Failed to apply highlight range', e);
  }
}

/**
 * Applies a full-width row highlight overlay.
 */
export function applyRowHighlight(parent: HTMLElement, boundary: RowBoundary): void {
  const overlay = document.createElement('div');
  overlay.className = 'ext-highlighter-row-overlay';

  overlay.style.position = 'absolute';

  // Anchor relative to offsetParent for correct scroll behavior
  const anchor = (parent.offsetParent as HTMLElement) || document.body;
  if (getComputedStyle(anchor).position === 'static') {
    anchor.style.position = 'relative';
  }
  const anchorRect = anchor.getBoundingClientRect();
  overlay.style.top = `${boundary.top - anchorRect.top - anchor.clientTop + anchor.scrollTop}px`;
  overlay.style.left = `${boundary.left - anchorRect.left - anchor.clientLeft + anchor.scrollLeft}px`;
  overlay.style.width = `${boundary.width}px`;
  overlay.style.height = `${boundary.height}px`;

  anchor.appendChild(overlay);
  activeRowOverlay = overlay;

  currentState = {
    target: overlay,
    originalStyle: null,
    range: null
  };
}

/**
 * Removes the currently active highlight and restores the DOM.
 */
export function clearHighlight(): void {
  // Clear span highlights
  if (currentState.target && currentState.target.className === 'ext-highlighter-active' && currentState.target.parentNode) {
    const parent = currentState.target.parentNode;

    // Move all children out of the span before removing it
    while (currentState.target.firstChild) {
      parent.insertBefore(currentState.target.firstChild, currentState.target);
    }

    // Remove the empty span
    parent.removeChild(currentState.target);

    // Normalize text nodes to prevent fragmentation
    parent.normalize();
  }

  // Clear row overlays
  if (activeRowOverlay) {
    activeRowOverlay.remove();
    activeRowOverlay = null;
  }

  // Reset state
  currentState = { target: null, originalStyle: null, range: null };
}

/**
 * Returns true if the clicked element is already the active highlight.
 */
export function isAlreadyHighlighted(element: HTMLElement | null): boolean {
  return element !== null && element === currentState.target;
}
