import type { HighlightConfig } from './types';
import { DEFAULT_CONFIG } from './types';

const STORAGE_KEY = 'highlight_config';

export const storage = {
  /**
   * Retrieves the current configuration from Chrome storage.
   * If no configuration exists, returns the default configuration.
   */
  async getConfig(): Promise<HighlightConfig> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const data = await chrome.storage.local.get(STORAGE_KEY);
        const config = data[STORAGE_KEY];
        if (!config) return DEFAULT_CONFIG;

        return this.migrateConfig(config);
      }
      return DEFAULT_CONFIG;
    } catch (error) {
      console.error('Failed to get config from storage', error);
      return DEFAULT_CONFIG;
    }
  },

  /**
   * Migrates old configuration formats to the current one.
   */
  migrateConfig(config: any): HighlightConfig {
    // Migration from single 'color' property
    if (config.color && !config.lightColor) {
      return {
        ...DEFAULT_CONFIG,
        ...config,
        lightColor: config.color,
        // The rest come from DEFAULT_CONFIG (darkColor, themeMode)
      };
    }

    // Ensure all required fields exist
    return {
      ...DEFAULT_CONFIG,
      ...config
    };
  },

  /**
   * Saves the provided configuration to Chrome storage.
   */
  async setConfig(config: HighlightConfig): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [STORAGE_KEY]: config });
      }
    } catch (error) {
      console.error('Failed to save config to storage', error);
    }
  },

  /**
   * Updates specific fields in the configuration.
   */
  async updateConfig(updates: Partial<HighlightConfig>): Promise<HighlightConfig> {
    const currentConfig = await this.getConfig();
    const newConfig = { ...currentConfig, ...updates };
    await this.setConfig(newConfig);
    return newConfig;
  },

  /**
   * Listens for changes to the configuration in storage.
   */
  onChange(callback: (newConfig: HighlightConfig) => void): void {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes[STORAGE_KEY]) {
          callback(changes[STORAGE_KEY].newValue as HighlightConfig);
        }
      });
    }
  }
};
