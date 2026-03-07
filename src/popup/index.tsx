import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { storage } from '../common/storage';
import type { HighlightConfig, HighlightMode } from '../common/types';
import { DEFAULT_CONFIG, COLOR_PRESETS } from '../common/types';

const Popup = () => {
  const [config, setConfig] = useState<HighlightConfig>(DEFAULT_CONFIG);
  const [openDropdown, setOpenDropdown] = useState<'light' | 'dark' | null>(null);

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

  const modeIcons: Record<HighlightMode, string> = {
    word: '🔡',
    sentence: '📝',
    paragraph: '📄',
    row: '📏',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ margin: 0, fontSize: '18px' }}>ADHD Read</h2>

      <div
        onClick={toggleEnabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '4px 0',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Active</span>
        <input
          id="enabledToggle"
          type="checkbox"
          checked={config.isEnabled}
          onChange={toggleEnabled}
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>Highlight Mode</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {(['word', 'sentence', 'paragraph', 'row'] as HighlightMode[]).map((mode) => (
            <div
              key={mode}
              onClick={() => setMode(mode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '6px 8px',
                borderRadius: '4px',
                backgroundColor: config.activeMode === mode ? '#e3f2fd' : 'transparent',
              }}
            >
              <input
                type="radio"
                name="mode"
                checked={config.activeMode === mode}
                onChange={() => setMode(mode)}
                onClick={(e) => e.stopPropagation()}
                style={{ cursor: 'pointer', margin: 0 }}
              />
              <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>
                {modeIcons[mode]}
              </span>
              <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Theme Colors</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Light swatch */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div
                onClick={() => setOpenDropdown(openDropdown === 'light' ? null : 'light')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: openDropdown === 'light' ? '#f0f0f0' : 'transparent',
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  backgroundColor: config.lightColor, border: '1px solid #ddd',
                }} />
                <span style={{ fontSize: '12px', flex: 1 }}>Light</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </div>
              {openDropdown === 'light' && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, marginTop: '2px',
                }}>
                  {COLOR_PRESETS.filter(p => p.recommended !== 'dark').map(p => (
                    <div
                      key={p.name}
                      onClick={() => {
                        updateConfig({ lightColor: p.hex });
                        setOpenDropdown(null);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 8px', cursor: 'pointer', fontSize: '12px',
                        backgroundColor: config.lightColor === p.hex ? '#e3f2fd' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (config.lightColor !== p.hex)
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          config.lightColor === p.hex ? '#e3f2fd' : 'transparent';
                      }}
                    >
                      <div style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        backgroundColor: p.hex, border: '1px solid #ddd',
                      }} />
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Dark swatch */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div
                onClick={() => setOpenDropdown(openDropdown === 'dark' ? null : 'dark')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: openDropdown === 'dark' ? '#f0f0f0' : 'transparent',
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  backgroundColor: config.darkColor, border: '1px solid #ddd',
                }} />
                <span style={{ fontSize: '12px', flex: 1 }}>Dark</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </div>
              {openDropdown === 'dark' && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, marginTop: '2px',
                }}>
                  {COLOR_PRESETS.filter(p => p.recommended !== 'light').map(p => (
                    <div
                      key={p.name}
                      onClick={() => {
                        updateConfig({ darkColor: p.hex });
                        setOpenDropdown(null);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 8px', cursor: 'pointer', fontSize: '12px',
                        backgroundColor: config.darkColor === p.hex ? '#e3f2fd' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (config.darkColor !== p.hex)
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          config.darkColor === p.hex ? '#e3f2fd' : 'transparent';
                      }}
                    >
                      <div style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        backgroundColor: p.hex, border: '1px solid #ddd',
                      }} />
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
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
