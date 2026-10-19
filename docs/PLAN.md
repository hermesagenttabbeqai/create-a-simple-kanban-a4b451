# Plan: Simple Kanban

## Task 1: Project scaffold
- assignee: claude
- requirements: NFR-01, NFR-02, NFR-03
- files: index.html, package.json, vite.config.ts, tsconfig.json, netlify.toml, src/main.tsx, src/index.css, .github/workflows/ci.yml
- branch: feature/scaffold
- done when: `npm run build` produces a `dist/` folder with no errors. The CI workflow runs `npm test` and `npm run build` on every push.

## Task 2: Data store and types
- assignee: claude
- requirements: BR-06, NFR-04
- files: src/types.ts, src/store.ts, src/store.test.ts
- branch: feature/store
- done when: `useStore` hook exposes `cards`, `addCard`, `updateCard`, `deleteCard`, `moveCard`. Cards survive a simulated page reload (localStorage round-trip). All store tests pass.

## Task 3: Card component
- assignee: devin
- requirements: BR-02, BR-03, BR-05, BR-07
- files: src/components/Card.tsx, src/components/Card.test.tsx
- branch: feature/card
- done when: The Card component renders a card's title and description. A user can click an edit icon to change the title inline. A user can click a delete button to remove the card. Left/right arrow buttons move the card one column. All Card tests pass.

  Context for Devin:
  - Stack: React 18.3.1 + TypeScript 5.5.3, built with Vite 5.4.1.
  - The `useStore` hook (src/store.ts) is already built. Import `useStore` and call `updateCard`, `deleteCard`, and `moveCard` from it.
  - Types are in src/types.ts. Column values are the string literals "todo", "inprogress", "done".
  - Design tokens are CSS custom properties in src/index.css (--color-primary, --color-danger, etc.).
  - `moveCard(id, direction)` where direction is "left" or "right".
  - Tests use Vitest + @testing-library/react. Run with `npm test`.

## Task 4: Column component
- assignee: claude
- requirements: BR-01, BR-04
- files: src/components/Column.tsx, src/components/Column.test.tsx
- branch: feature/column
- done when: The Column component renders its header and a list of Card components for cards in that column. It includes an inline form to add a new card (title required, description optional ≤ 200 chars). All Column tests pass.

## Task 5: Board component and wiring
- assignee: claude
- requirements: BR-02, BR-04
- files: src/components/Board.tsx, src/components/Board.test.tsx, src/App.tsx
- branch: feature/board
- done when: Board renders all three columns (To Do, In Progress, Done). Cards can be dragged between columns using @dnd-kit. App.tsx mounts the Board. All Board tests pass.

## Task 6: End-to-end tests
- assignee: claude
- requirements: BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07
- files: playwright.config.ts, e2e/kanban.spec.ts
- branch: feature/e2e
- done when: Playwright tests cover: creating a card, editing its title, moving it to another column, deleting it, and verifying state persists after reload. All E2E tests pass against the Vite dev server.
