export type HighlightMode = 'word' | 'sentence' | 'paragraph' | 'row';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface HighlightConfig {
  activeMode: HighlightMode;
  lightColor: string;
  darkColor: string;
  themeMode: ThemeMode;
  opacity: number;
  isEnabled: boolean;
}

export interface ColorPreset {
  name: string;
  hex: string;
  recommended: 'light' | 'dark' | 'both';
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Yellow', hex: 'hsla(57, 100%, 73%, 0.55)', recommended: 'light' },
  { name: 'Peach', hex: 'hsla(14, 100%, 78%, 0.55)', recommended: 'light' },
  { name: 'Mint', hex: 'hsla(121, 40%, 74%, 0.55)', recommended: 'light' },
  { name: 'Sky', hex: 'hsla(199, 92%, 74%, 0.55)', recommended: 'light' },
  { name: 'Lavender', hex: 'hsla(291, 47%, 71%, 0.55)', recommended: 'light' },
  { name: 'Teal', hex: 'hsla(174, 100%, 15%, 0.60)', recommended: 'dark' },
  { name: 'Deep Purple', hex: 'hsla(251, 69%, 34%, 0.60)', recommended: 'dark' },
  { name: 'Dark Blue', hex: 'hsla(217, 85%, 34%, 0.60)', recommended: 'dark' },
  { name: 'Charcoal Green', hex: 'hsla(125, 49%, 24%, 0.60)', recommended: 'dark' },
  { name: 'Dark Amber', hex: 'hsla(21, 100%, 45%, 0.60)', recommended: 'dark' },
];

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
  lightColor: 'hsla(57, 100%, 73%, 0.55)', // Soft yellow
  darkColor: 'hsla(174, 100%, 15%, 0.60)',  // Muted teal
  themeMode: 'system',
  opacity: 0.5,
  isEnabled: true,
};
