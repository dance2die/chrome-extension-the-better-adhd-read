import { describe, expect, test, spyOn } from "bun:test";
import { getEffectiveColor } from "../../src/content/index";
import { DEFAULT_CONFIG } from "../../src/common/types";
import type { HighlightConfig } from "../../src/common/types";

describe("Theme Detection Logic", () => {
    const testConfig: HighlightConfig = {
        ...DEFAULT_CONFIG,
        lightColor: "hsla(57, 100%, 73%, 0.55)",
        darkColor: "hsla(174, 100%, 15%, 0.60)",
    };

    test("uses lightColor when themeMode is 'light'", () => {
        const config = { ...testConfig, themeMode: 'light' as const };
        expect(getEffectiveColor(config)).toBe(config.lightColor);
    });

    test("uses darkColor when themeMode is 'dark'", () => {
        const config = { ...testConfig, themeMode: 'dark' as const };
        expect(getEffectiveColor(config)).toBe(config.darkColor);
    });

    test("uses correct color for 'system' mode (light)", () => {
        // Mock matchMedia to return false for dark mode
        global.window = {
            matchMedia: (query: string) => ({
                matches: false,
                addEventListener: () => { },
                removeEventListener: () => { },
            })
        } as any;

        const config = { ...testConfig, themeMode: 'system' as const };
        expect(getEffectiveColor(config)).toBe(config.lightColor);
    });

    test("uses correct color for 'system' mode (dark)", () => {
        // Mock matchMedia to return true for dark mode
        global.window = {
            matchMedia: (query: string) => ({
                matches: true,
                addEventListener: () => { },
                removeEventListener: () => { },
            })
        } as any;

        const config = { ...testConfig, themeMode: 'system' as const };
        expect(getEffectiveColor(config)).toBe(config.darkColor);
    });
});
