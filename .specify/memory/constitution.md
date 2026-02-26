<!--
  Sync Impact Report:
  - Version change: 1.1.0 → 1.2.0
  - List of modified principles:
    - V. Git Workflow & Conventional Commits (Added): Mandated feature branches and conventional commits.
  - Added sections: None
  - Removed sections: None
  - Templates requiring updates:
    - .specify/templates/plan-template.md (✅ updated)
    - .specify/templates/spec-template.md (✅ updated)
  - Follow-up TODOs: None
-->

# ADHD Read Chrome Extension Constitution

## Core Principles

### I. Code Quality
Code MUST be clean, modular, and easy to maintain. Use consistent naming conventions, maintain small functions, and ensure high readability. TypeScript MUST be used for all source code to ensure type safety and early error detection; JavaScript is NOT permitted. Bun MUST be used as the primary runtime and package manager for development, testing, and building.

### II. Testing Standards
All core logic MUST be covered by unit tests. Critical user paths MUST have integration or E2E tests using Playwright. No feature is considered complete without automated verification.

### III. User Experience Consistency
The UI MUST follow established design patterns to ensure a consistent and distraction-free experience for users with ADHD. Interactions SHOULD be predictable, responsive, and accessible.

### IV. Performance Requirements
Extension MUST be lightweight and fast. Largest Contentful Paint (LCP) and other Core Web Vitals SHOULD be optimized. Content injection MUST NOT degrade page load performance or responsiveness.

### V. Git Workflow & Conventional Commits
All development MUST occur on feature branches. The `main` branch MUST NOT be modified directly without explicit user approval. All branch names and commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat/`, `fix/`, `docs/`, `chore/`).

## Additional Constraints

MUST adhere to Chrome Extension Manifest V3. No external trackers or invasive data collection. Privacy-first by design.

## Development Workflow

Every change MUST go through a code review process. Automated CI/CD pipelines SHOULD run tests on every pull request using Bun. Versioning MUST follow semantic rules.

## Governance

The constitution is the source of truth for the project's development principles. Amendments require rationale and MUST be documented with a version bump. All pull requests MUST verify compliance with these principles.

**Version**: 1.2.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-02-25
