# Contract: Simple Kanban

## Overview

A single-page Kanban board built entirely in the browser. It has three fixed columns (To Do, In Progress, Done) and lets users create, edit, move, and delete cards. All data is stored in the browser's localStorage — no server, no account required.

## Assumptions

- The app is a single HTML page with no routing.
- "Move by button" (BR-02) means each card has arrow buttons to move it one column left or right.
- Card order within a column is preserved in storage.
- On first load, the board is empty (no seed data).
- Drag-and-drop uses mouse events; touch drag is a nice-to-have, not required.
- Deployment target is Netlify (free tier, automatic deploy from main branch).

## Stack

| Concern | Choice | Version |
|---------|--------|---------|
| Language | TypeScript | 5.5.3 |
| UI framework | React | 18.3.1 |
| Build tool | Vite | 5.4.1 |
| Drag and drop | @dnd-kit/core + @dnd-kit/sortable | 6.1.0 / 8.0.0 |
| Unit tests | Vitest + @testing-library/react | 2.0.5 / 16.0.0 |
| User event simulation | @testing-library/user-event | 14.5.2 |
| E2E tests | Playwright | 1.46.1 |
| Hosting | Netlify | — |

## Data model

Everything lives in `localStorage` under the key `kanban-state`.

### Card

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Generated on creation |
| title | string | 1–100 characters |
| description | string | 0–200 characters |
| column | "todo" \| "inprogress" \| "done" | Current column |
| order | number | Position within the column (0-based) |

### BoardState

```
{ cards: Card[] }
```

Serialised to JSON and stored at `localStorage.kanban-state`.

## API contracts

No server API. This is a pure client-side app.

Module interfaces:

| Module | Exported | Inputs | Output |
|--------|----------|--------|--------|
| `src/store.ts` | `useStore()` hook | — | `{ cards, addCard, updateCard, deleteCard, moveCard }` |
| `src/types.ts` | `Card`, `Column`, `BoardState` types | — | TypeScript types only |

See `docs/openapi.yaml` for the (empty) OpenAPI file.

## Design tokens

Defined as CSS custom properties in `src/index.css`.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F1F5F9` | Page background |
| `--color-surface` | `#FFFFFF` | Card background |
| `--color-text` | `#1E293B` | Body text (contrast ≥ 4.5:1 on surface) |
| `--color-text-muted` | `#64748B` | Secondary text (contrast ≥ 4.5:1 on surface) |
| `--color-border` | `#CBD5E1` | Card and column borders |
| `--color-primary` | `#2563EB` | Buttons, focus rings |
| `--color-primary-hover` | `#1D4ED8` | Button hover |
| `--color-col-todo` | `#EFF6FF` | To Do column header |
| `--color-col-inprogress` | `#FEF9C3` | In Progress column header |
| `--color-col-done` | `#F0FDF4` | Done column header |
| `--color-danger` | `#DC2626` | Delete button |
| `--radius` | `6px` | Border radius |
| `--space` | `8px` | Base spacing unit |
| `--font` | `system-ui, sans-serif` | All text |

## Folder layout

```
/
├── index.html                  # Entry HTML (Task 1)
├── package.json                # Dependencies and scripts (Task 1)
├── vite.config.ts              # Vite + Vitest config (Task 1)
├── tsconfig.json               # TypeScript config (Task 1)
├── playwright.config.ts        # Playwright config (Task 6)
├── netlify.toml                # Netlify deploy config (Task 1)
├── .github/
│   └── workflows/
│       └── ci.yml              # CI: test + build (Task 1)
├── docs/
│   ├── BRD.md
│   ├── CONTRACT.md
│   ├── openapi.yaml
│   └── PLAN.md
├── src/
│   ├── main.tsx                # React root mount (Task 1)
│   ├── index.css               # Global styles + tokens (Task 1)
│   ├── types.ts                # Shared TypeScript types (Task 2)
│   ├── store.ts                # useStore hook + localStorage (Task 2)
│   ├── store.test.ts           # Store unit tests (Task 2)
│   ├── App.tsx                 # Root component, renders Board (Task 5)
│   └── components/
│       ├── Card.tsx            # Card display, edit, delete, move buttons (Task 3)
│       ├── Card.test.tsx       # Card unit tests (Task 3)
│       ├── Column.tsx          # Column display, add-card form (Task 4)
│       ├── Column.test.tsx     # Column unit tests (Task 4)
│       ├── Board.tsx           # Board layout, DnD context (Task 5)
│       └── Board.test.tsx      # Board unit tests (Task 5)
└── e2e/
    └── kanban.spec.ts          # End-to-end tests (Task 6)
```

## Requirement map

| Requirement | Satisfied by |
|-------------|-------------|
| BR-01 | Task 4 (add-card form in Column) |
| BR-02 | Task 3 (move buttons on Card), Task 5 (drag-and-drop in Board) |
| BR-03 | Task 3 (delete button on Card) |
| BR-04 | Task 5 (Board renders exactly 3 columns) |
| BR-05 | Task 3 (inline edit on Card) |
| BR-06 | Task 2 (localStorage persistence in store) |
| BR-07 | Task 3 (description field on Card) |
| NFR-01 | Task 1 (Vite production build, no heavy deps) |
| NFR-02 | Task 1 (responsive CSS, min-width 768px) |
| NFR-03 | Task 1 (design tokens chosen at ≥ 4.5:1 contrast) |
| NFR-04 | Task 2 (localStorage only, no network calls) |
