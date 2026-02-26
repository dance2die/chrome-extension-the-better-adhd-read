import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { storage } from '../common/storage';
import { DEFAULT_CONFIG, COLOR_PRESETS } from '../common/types';
import type { HighlightConfig, ThemeMode } from '../common/types';

const Options = () => {
    const [config, setConfig] = useState<HighlightConfig>(DEFAULT_CONFIG);

    useEffect(() => {
        storage.getConfig().then(setConfig);
    }, []);

    const updateConfig = async (updates: Partial<HighlightConfig>) => {
        const newConfig = { ...config, ...updates };
        await storage.setConfig(newConfig);
        setConfig(newConfig);

        // Notify all tabs
        chrome.runtime.sendMessage({
            type: 'CONFIG_UPDATE',
            payload: newConfig,
        });
    };

    const resetToDefaults = () => {
        if (confirm('Reset all highlight settings to defaults?')) {
            updateConfig(DEFAULT_CONFIG);
        }
    };

    return (
        <div className="options-container">
            <header>
                <h1>Better ADHD Read</h1>
                <p style={{ color: 'gray', marginTop: '8px' }}>Personalize your reading experience</p>
            </header>

            <div className="card">
                <h2 className="section-title">Theme Preference</h2>
                <div className="setting-group">
                    <label className="label">When should we use light or dark highlights?</label>
                    <div className="radio-group">
                        {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                            <button
                                key={mode}
                                className={`radio-btn ${config.themeMode === mode ? 'active' : ''}`}
                                onClick={() => updateConfig({ themeMode: mode })}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="section-title">Light Theme Highlights</h2>
                <div className="presets">
                    {COLOR_PRESETS.filter(p => p.recommended !== 'dark').map(p => (
                        <button
                            key={p.name}
                            className={`preset-btn ${config.lightColor === p.hex ? 'active' : ''}`}
                            onClick={() => updateConfig({ lightColor: p.hex })}
                        >
                            <div className="color-circle" style={{ backgroundColor: p.hex }} />
                            {p.name}
                        </button>
                    ))}
                </div>
                <div className="custom-color">
                    <label className="label" style={{ margin: 0 }}>Custom color:</label>
                    <input
                        type="color"
                        value={config.lightColor.startsWith('hsla') ? '#fff176' : config.lightColor}
                        onChange={(e) => updateConfig({ lightColor: e.target.value })}
                    />
                    <span style={{ fontSize: '12px', color: 'gray' }}>Note: Presets use HSLA for better transparency.</span>
                </div>
            </div>

            <div className="card">
                <h2 className="section-title">Dark Theme Highlights</h2>
                <div className="presets">
                    {COLOR_PRESETS.filter(p => p.recommended !== 'light').map(p => (
                        <button
                            key={p.name}
                            className={`preset-btn ${config.darkColor === p.hex ? 'active' : ''}`}
                            onClick={() => updateConfig({ darkColor: p.hex })}
                        >
                            <div className="color-circle" style={{ backgroundColor: p.hex }} />
                            {p.name}
                        </button>
                    ))}
                </div>
                <div className="custom-color">
                    <label className="label" style={{ margin: 0 }}>Custom color:</label>
                    <input
                        type="color"
                        value={config.darkColor.startsWith('hsla') ? '#004d40' : config.darkColor}
                        onChange={(e) => updateConfig({ darkColor: e.target.value })}
                    />
                </div>
            </div>

            <div className="card">
                <h2 className="section-title">Global Opacity</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label className="label">Intensity</label>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{Math.round(config.opacity * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.opacity}
                    onChange={(e) => updateConfig({ opacity: parseFloat(e.target.value) })}
                />
            </div>

            <div className="card">
                <h2 className="section-title">Preview</h2>
                <div className="preview-grid">
                    <div className="preview-box light">
                        <p>On a <strong>light website</strong> like Wikipedia, your highlight will look like <span className="highlighted" style={{ '--hl-color': config.lightColor } as any}>this sentence right here</span>.</p>
                    </div>
                    <div className="preview-box dark">
                        <p>On a <strong>dark website</strong> like Hacker News, your highlight will look like <span className="highlighted" style={{ '--hl-color': config.darkColor } as any}>this sentence right here</span>.</p>
                    </div>
                </div>
            </div>

            <div className="footer">
                <button className="secondary" onClick={resetToDefaults}>Reset to Defaults</button>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<Options />);
}
