export interface TextBoundary {
  start: number;
  end: number;
  segment: string;
}

/**
 * Finds the boundaries of a sentence containing the given offset.
 * Relies on Intl.Segmenter for locale-aware, robust punctuation handling.
 *
 * @param text The full text string to search within.
 * @param offset The character index where the user clicked/focused.
 * @returns The start/end indices and the sentence string, or null if invalid.
 */
export function getSentenceBoundaries(text: string, offset: number): TextBoundary | null {
  if (!text || offset < 0 || offset >= text.length) {
    return null;
  }

  // Use the browser's native Intl.Segmenter for sentence boundary detection
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' });
  const segments = segmenter.segment(text);

  let currentStart = 0;
  for (const segmentData of segments) {
    const currentEnd = currentStart + segmentData.segment.length;

    // Check if the given offset falls within this segment
    if (offset >= currentStart && offset < currentEnd) {
      return {
        start: currentStart,
        end: currentEnd,
        segment: segmentData.segment,
      };
    }
    currentStart = currentEnd;
  }

  return null;
}

export interface RowBoundary {
  top: number;
  height: number;
  width: number;
  left: number;
}

/**
 * Calculates the bounding box for a single row of text.
 * Since CSS doesn't have a "row" selector, we use the character's 
 * line-height and vertical position.
 */
export function getRowBoundaries(range: Range): RowBoundary | null {
  const rects = range.getClientRects();
  if (rects.length === 0) return null;

  // We take the first rect (where the click happened)
  const rect = rects[0];
  if (!rect) return null;

  // For a row, we want to know the vertical start/end.
  // We'll also return the width of the container later in the highlighter.
  return {
    top: rect.top + window.scrollY,
    height: rect.height,
    left: rect.left + window.scrollX,
    width: rect.width
  };
}
