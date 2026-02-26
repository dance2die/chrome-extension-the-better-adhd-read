import type { ExtensionMessage, HighlightConfig } from '../common/types';
import { DEFAULT_CONFIG } from '../common/types';

// Global state for the content script
let currentConfig: HighlightConfig = DEFAULT_CONFIG;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.type === 'CONFIG_SYNC') {
    console.log('Received updated config:', message.payload);
    currentConfig = message.payload;
    
    // In later phases, we will react to config changes here
    // e.g., if isEnabled becomes false, remove all current highlights.
  }
});

// Initialize by fetching the current config from storage
import { storage } from '../common/storage';
storage.getConfig().then((config) => {
  currentConfig = config;
  console.log('ADHD Read Highlighter content script initialized with config:', config);
});
