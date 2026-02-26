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
  const setOpacity = (e: React.ChangeEvent<HTMLInputElement>) => updateConfig({ opacity: parseFloat(e.target.value) });

  const clearAll = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CLEAR_HIGHLIGHTS' });
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ margin: 0, fontSize: '18px' }}>ADHD Read</h2>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="enabledToggle" style={{ fontWeight: 'bold' }}>Active</label>
        <input
          id="enabledToggle"
          type="checkbox"
          checked={config.isEnabled}
          onChange={toggleEnabled}
        />
      </div>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>Highlight Mode</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {(['word', 'sentence', 'paragraph', 'row'] as HighlightMode[]).map((mode) => (
            <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '14px' }}>
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

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Theme Colors</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: config.lightColor, border: '1px solid #ddd' }} />
              <span style={{ fontSize: '12px' }}>Light</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: config.darkColor, border: '1px solid #ddd' }} />
              <span style={{ fontSize: '12px' }}>Dark</span>
            </div>
          </div>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            style={{
              padding: '6px',
              backgroundColor: 'transparent',
              border: '1px solid #2196f3',
              color: '#2196f3',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '4px'
            }}
          >
            ⚙️ Customize Colors
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Opacity</label>
            <span style={{ fontSize: '12px' }}>{Math.round(config.opacity * 100)}%</span>
          </div>
          <input type="range" min="0.1" max="1.0" step="0.05" value={config.opacity} onChange={setOpacity} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <button
        onClick={clearAll}
        style={{
          padding: '8px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Clear Current Highlight
      </button>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
