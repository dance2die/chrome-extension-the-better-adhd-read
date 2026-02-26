# Data Model: Text Highlighter Extension

## Entities

### HighlightConfig (Storage)
Persisted in `chrome.storage.local`.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `activeMode` | `'word' \| 'sentence' \| 'paragraph' \| 'row'` | Highlight granularity | MUST be one of 4 |
| `color` | `string` | Hex or RGBA string | Valid color format |
| `opacity` | `number` | Alpha (0.0 to 1.0) | Range 0.0-1.0 |
| `isEnabled` | `boolean` | Master toggle state | Boolean |

### HighlightState (Runtime)
Active state in content script.

| Field | Type | Description |
|-------|------|-------------|
| `target` | `HTMLElement \| null` | Currently highlighted element |
| `originalStyle` | `string \| null` | Inline styles before highlighting |
| `range` | `Range \| null` | Text range for Word/Sentence |

## State Transitions

1. **Popup Interaction**: Changes `HighlightConfig` in storage.
2. **Storage Changed**: Background script broadcasts `CONFIG_SYNC` message to all content scripts.
3. **User Click**: 
   - Identify clicked element.
   - Use `Intl.Segmenter` to find boundaries.
   - Apply highlight class/overlay.
   - Store as current `HighlightState`.
