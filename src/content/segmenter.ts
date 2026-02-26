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
