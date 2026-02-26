import { storage } from '../common/storage';
import type { ExtensionMessage } from '../common/types';

// Listen for updates from the popup
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.type === 'CONFIG_UPDATE') {
    // Save to storage; the storage.onChange listener will handle broadcasting
    storage.setConfig(message.payload).then(() => {
      sendResponse({ status: 'success' });
    });
    return true; // Keep the message channel open for async response
  }
});

// Listen for storage changes and broadcast to all tabs
storage.onChange((newConfig) => {
  chrome.tabs.query({}, (tabs) => {
    const syncMessage: ExtensionMessage = {
      type: 'CONFIG_SYNC',
      payload: newConfig,
    };
    
    for (const tab of tabs) {
      if (tab.id) {
        // We catch errors here because not all tabs can receive messages (e.g., chrome:// URLs)
        chrome.tabs.sendMessage(tab.id, syncMessage).catch(() => {});
      }
    }
  });
});

console.log('ADHD Read Highlighter background worker initialized.');
