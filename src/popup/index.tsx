import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { storage } from '../common/storage';
import type { HighlightConfig } from '../common/types';
import { DEFAULT_CONFIG } from '../common/types';

const Popup = () => {
  const [config, setConfig] = useState<HighlightConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    // Load initial config
    storage.getConfig().then(setConfig);

    // Listen for changes
    storage.onChange(setConfig);
  }, []);

  const toggleEnabled = async () => {
    const newConfig = { ...config, isEnabled: !config.isEnabled };
    await storage.setConfig(newConfig);
    setConfig(newConfig);
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'CONFIG_UPDATE',
      payload: newConfig,
    });
  };

  return (
    <div>
      <h2>Text Highlighter</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
        <label htmlFor="enabledToggle">Enable Extension</label>
        <input
          id="enabledToggle"
          type="checkbox"
          checked={config.isEnabled}
          onChange={toggleEnabled}
        />
      </div>
      {/* Modes and colors will be added in Phase 4/5/6 */}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
