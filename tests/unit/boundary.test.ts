import { describe, expect, test } from "bun:test";
import { getSentenceBoundaries } from "../../src/content/segmenter";

describe("Sentence Boundary Detection (Intl.Segmenter)", () => {
  test("finds boundary for a simple sentence", () => {
    const text = "Hello world. This is a test.";
    // Offset 2 points to 'e' in "Hello"
    const boundary = getSentenceBoundaries(text, 2);
    expect(boundary).not.toBeNull();
    expect(boundary!.start).toBe(0);
    expect(boundary!.end).toBe(13); // Includes the space after the period in some locales, let's test strict segment
    expect(boundary!.segment.trim()).toBe("Hello world.");
  });

  test("finds boundary for the second sentence", () => {
    const text = "Hello world. This is a test.";
    // Offset 15 points to 'h' in "This"
    const boundary = getSentenceBoundaries(text, 15);
    expect(boundary).not.toBeNull();
    expect(boundary!.start).toBe(13); 
    expect(boundary!.segment.trim()).toBe("This is a test.");
  });

  test("handles punctuation correctly", () => {
    const text = "Wait, what?! Yes, exactly.";
    const seg1 = getSentenceBoundaries(text, 2);
    expect(seg1).not.toBeNull();
    expect(seg1!.segment.trim()).toBe("Wait, what?!");
    
    const seg2 = getSentenceBoundaries(text, 15);
    expect(seg2).not.toBeNull();
    expect(seg2!.segment.trim()).toBe("Yes, exactly.");
  });

  test("returns null if text is empty or offset is invalid", () => {
    expect(getSentenceBoundaries("", 0)).toBeNull();
    expect(getSentenceBoundaries("Test.", 10)).toBeNull();
  });
});
