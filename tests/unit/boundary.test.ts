import { describe, expect, test } from "bun:test";
import { getSentenceBoundaries, getWordBoundaries, getParagraphBoundaries } from "../../src/content/segmenter";

describe("Text Boundary Detection (Intl.Segmenter)", () => {
  describe("Sentence Boundaries", () => {
    test("finds boundary for a simple sentence", () => {
      const text = "Hello world. This is a test.";
      const boundary = getSentenceBoundaries(text, 2);
      expect(boundary).not.toBeNull();
      expect(boundary!.start).toBe(0);
      expect(boundary!.end).toBe(13);
      expect(boundary!.segment.trim()).toBe("Hello world.");
    });

    test("returns null if text is empty or offset is invalid", () => {
      expect(getSentenceBoundaries("", 0)).toBeNull();
      expect(getSentenceBoundaries("Test.", 10)).toBeNull();
    });
  });

  describe("Word Boundaries", () => {
    test("finds boundary for a word", () => {
      const text = "Hello world. This is a test.";
      // Offset 2 points to 'e' in "Hello"
      const boundary = getWordBoundaries(text, 2);
      expect(boundary).not.toBeNull();
      expect(boundary!.segment).toBe("Hello");
      expect(boundary!.start).toBe(0);
      expect(boundary!.end).toBe(5);
    });

    test("finds boundary for a word later in the string", () => {
      const text = "Hello world.";
      // Offset 7 points to 'o' in "world"
      const boundary = getWordBoundaries(text, 7);
      expect(boundary!.segment).toBe("world");
    });
  });

  describe("Paragraph Boundaries (Mocked logic)", () => {
    test("returns full text as paragraph for simple strings", () => {
      const text = "A single paragraph.";
      const boundary = getParagraphBoundaries(text, 5);
      expect(boundary).not.toBeNull();
      expect(boundary!.segment).toBe("A single paragraph.");
    });
  });
});
