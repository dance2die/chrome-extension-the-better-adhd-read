import { describe, expect, test } from "bun:test";
import { storage } from "../../src/common/storage";
import { DEFAULT_CONFIG } from "../../src/common/types";

describe("Config Migration", () => {
    test("migrates old config with 'color' to new format", () => {
        const oldConfig = {
            activeMode: 'sentence',
            color: '#ff0000',
            opacity: 0.8,
            isEnabled: true
        };

        const migrated = storage.migrateConfig(oldConfig);

        expect(migrated.lightColor).toBe('#ff0000');
        expect(migrated.darkColor).toBe(DEFAULT_CONFIG.darkColor);
        expect(migrated.themeMode).toBe('system');
        expect(migrated.opacity).toBe(0.8);
    });

    test("does not change already migrated config", () => {
        const newConfig = {
            ...DEFAULT_CONFIG,
            lightColor: '#123456',
            darkColor: '#654321',
            themeMode: 'dark' as const
        };

        const migrated = storage.migrateConfig(newConfig);

        expect(migrated.lightColor).toBe('#123456');
        expect(migrated.darkColor).toBe('#654321');
        expect(migrated.themeMode).toBe('dark');
    });

    test("fills in missing fields with defaults", () => {
        const partialConfig = {
            lightColor: '#ffffff'
        };

        const migrated = storage.migrateConfig(partialConfig);

        expect(migrated.lightColor).toBe('#ffffff');
        expect(migrated.darkColor).toBe(DEFAULT_CONFIG.darkColor);
        expect(migrated.activeMode).toBe(DEFAULT_CONFIG.activeMode);
    });
});
