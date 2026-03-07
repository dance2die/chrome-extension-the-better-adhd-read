# Changelog

All notable changes to Better ADHD Read will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-03-07

### Added
- Options page with color presets and theme settings
- System theme detection for highlight color (light/dark mode)
- Config migration for light/dark colors
- Privacy policy

### Changed
- Popup: highlight modes stacked vertically with emojis and clickable rows
- Popup: "Active" row is now fully clickable
- Popup: theme color preset dropdowns for Light/Dark swatches
- Popup: word mode emoji changed to 🔡

### Fixed
- Sentence highlighting inconsistency (DOM text node invalidation)
- Content script export error (`getEffectiveColor` moved to common file)
- Popup blank screen (corrected script src reference)
- Removed unused `scripting` permission (Chrome Web Store compliance)

### Infrastructure
- Cross-platform packaging with bestzip
- Added `*.zip` to `.gitignore`

## [1.0.0] - 2026-02-25

### Added
- Initial release of Better ADHD Read
- Sentence, word, and paragraph highlighting modes
- Click-to-highlight with configurable colors
- Chrome Extension Manifest V3 support
