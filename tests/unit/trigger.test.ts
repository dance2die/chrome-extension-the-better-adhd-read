import { describe, expect, test } from "bun:test";
import { DEFAULT_CONFIG } from "../../src/common/types";
import type { HighlightConfig } from "../../src/common/types";

describe("Trigger Mode Config", () => {
  test("DEFAULT_CONFIG includes triggerMode set to 'click'", () => {
    expect(DEFAULT_CONFIG.triggerMode).toBe("click");
  });

  test("triggerMode is backfilled for old configs via spread", () => {
    // Simulate an old config missing the triggerMode field
    const oldConfig = {
      activeMode: "sentence",
      lightColor: "hsla(57, 100%, 73%, 0.55)",
      darkColor: "hsla(174, 100%, 15%, 0.60)",
      themeMode: "system",
      opacity: 0.5,
      isEnabled: true,
      // no triggerMode
    } as unknown as Record<string, unknown>;

    const migrated: HighlightConfig = { ...DEFAULT_CONFIG, ...oldConfig };
    expect(migrated.triggerMode).toBe("click");
  });

  test("triggerMode 'hover' is preserved when already set", () => {
    const existingConfig = {
      ...DEFAULT_CONFIG,
      triggerMode: "hover",
    } as unknown as Record<string, unknown>;

    const migrated: HighlightConfig = { ...DEFAULT_CONFIG, ...existingConfig };
    expect(migrated.triggerMode).toBe("hover");
  });
});
