import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { storage } from '../common/storage';
import type { HighlightConfig, HighlightMode } from '../common/types';
import { DEFAULT_CONFIG } from '../common/types';

const Popup = () => {
  const [config, setConfig] = useState<HighlightConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    // Load initial config
    storage.getConfig().then(setConfig);

    // Listen for changes
    storage.onChange(setConfig);
  }, []);

  const updateConfig = async (updates: Partial<HighlightConfig>) => {
    const newConfig = { ...config, ...updates };
    await storage.setConfig(newConfig);
    setConfig(newConfig);
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'CONFIG_UPDATE',
      payload: newConfig,
    });
  };

  const toggleEnabled = () => updateConfig({ isEnabled: !config.isEnabled });
  const setMode = (mode: HighlightMode) => updateConfig({ activeMode: mode });

  return (
    <div>
      <h2>Better ADHD Read</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <label htmlFor="enabledToggle" style={{ fontWeight: 'bold' }}>Active</label>
        <input
          id="enabledToggle"
          type="checkbox"
          checked={config.isEnabled}
          onChange={toggleEnabled}
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Mode</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(['sentence', 'row'] as HighlightMode[]).map((mode) => (
            <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mode"
                checked={config.activeMode === mode}
                onChange={() => setMode(mode)}
              />
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
