# Interface Contracts: Text Highlighter Extension

## Extension Internal Messaging

Communication between Popup, Background, and Content Scripts.

### Message: CONFIG_UPDATE
Triggered when user changes settings in the popup.

| Field | Type | Description |
|-------|------|-------------|
| `type` | `'CONFIG_UPDATE'` | Message identifier |
| `config` | `HighlightConfig` | The updated configuration object |

**Sender**: Popup  
**Receiver**: Background (to store) and Content (to apply)

### Message: TOGGLE_STATE
Quickly enable or disable the highlighter.

| Field | Type | Description |
|-------|------|-------------|
| `type` | `'TOGGLE_STATE'` | Message identifier |
| `isEnabled` | `boolean` | New active state |

**Sender**: Popup / Keyboard Shortcut  
**Receiver**: Background / Content

## Storage Interface (chrome.storage.local)

The extension uses the following key:

| Key | Value Type | Description |
|-----|------------|-------------|
| `highlight_config` | `HighlightConfig` | The primary configuration for the extension |
