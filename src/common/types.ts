export type HighlightMode = 'word' | 'sentence' | 'paragraph' | 'row';

export interface HighlightConfig {
  activeMode: HighlightMode;
  color: string;
  opacity: number;
  isEnabled: boolean;
}

export interface HighlightState {
  target: HTMLElement | null;
  originalStyle: string | null;
  range: Range | null;
}

export interface TextBoundary {
  start: number;
  end: number;
  segment: string;
}

// Internal Messaging Protocols
export type ExtensionMessage = ConfigUpdateMessage | ConfigSyncMessage;

export interface ConfigUpdateMessage {
  type: 'CONFIG_UPDATE';
  payload: HighlightConfig;
}

export interface ConfigSyncMessage {
  type: 'CONFIG_SYNC';
  payload: HighlightConfig;
}

export const DEFAULT_CONFIG: HighlightConfig = {
  activeMode: 'sentence',
  color: '#ffff00', // Default light yellow
  opacity: 0.5,
  isEnabled: true,
};
