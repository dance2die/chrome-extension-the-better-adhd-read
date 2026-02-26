import type { HighlightConfig } from './types';

/**
 * Determines the final highlight color based on the config and current theme.
 */
export function getEffectiveColor(config: HighlightConfig): string {
    if (config.themeMode === 'light') return config.lightColor;
    if (config.themeMode === 'dark') return config.darkColor;

    // 'system' mode
    const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? config.darkColor : config.lightColor;
}
