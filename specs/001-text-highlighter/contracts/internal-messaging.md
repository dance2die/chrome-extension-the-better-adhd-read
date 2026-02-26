# Interface Contracts: Text Highlighter Extension (Internal)

## Extension Internal Messaging

### CONFIG_UPDATE
Triggered when the user changes settings in the popup.

- **Sender**: Popup UI
- **Receiver**: Background Service Worker
- **Payload**:
  ```json
  {
    "type": "CONFIG_UPDATE",
    "payload": {
      "activeMode": "word | sentence | paragraph | row",
      "color": "string",
      "opacity": "number",
      "isEnabled": "boolean"
    }
  }
  ```

### CONFIG_SYNC (Broadcast)
Broadcasted to all active tabs when configuration changes.

- **Sender**: Background Service Worker
- **Receiver**: All active content scripts
- **Payload**:
  ```json
  {
    "type": "CONFIG_SYNC",
    "payload": {
      "activeMode": "word | sentence | paragraph | row",
      "color": "string",
      "opacity": "number",
      "isEnabled": "boolean"
    }
  }
  ```

## Content Script DOM Interaction

### Highlight Mode: Word/Sentence
- **Implementation**: Wrap identified text in a `<span>` with class `.ext-highlighter-active`.
- **Constraint**: Must restore original text structure upon de-highlighting.

### Highlight Mode: Row
- **Implementation**: Absolute positioned overlay `<div>` relative to the viewport.
- **Style**: `background-color: var(--highlight-color); pointer-events: none; z-index: 999999;`
