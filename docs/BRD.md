# Business Requirements: Simple Kanban

## Goal

A lightweight Kanban board that lets a single user (or a small team) manage tasks visually by moving cards across columns. It is simple by design: no account system, no complex configuration — just a board you can use right away.

## Users

Anyone who needs to track tasks visually: individuals, small teams, or students. Used on a desktop or laptop browser. Mobile browsers should display the board readably even if drag-and-drop is not supported on touch.

## Business requirements

| ID    | Requirement |
|-------|-------------|
| BR-01 | A user can create a new card with a title. |
| BR-02 | A user can move a card between columns by dragging it or using a button. |
| BR-03 | A user can delete a card. |
| BR-04 | The board has exactly three columns: To Do, In Progress, and Done. |
| BR-05 | A user can edit the title of an existing card. |
| BR-06 | The board state is saved automatically so it is still there after a page refresh. |
| BR-07 | A user can add an optional short description (up to 200 characters) to a card. |

## Quality requirements

- NFR-01: The board loads in under 2 seconds on a standard desktop connection.
- NFR-02: The layout is usable on screens 768 px wide and above.
- NFR-03: Text has sufficient contrast to meet basic readability (WCAG AA for normal text).
- NFR-04: No user data is sent to any external server; everything stays in the browser.

## Not included

- User accounts, login, or authentication.
- Multiple boards or workspaces.
- Team collaboration or real-time sync between different browsers.
- File or image attachments on cards.
- Due dates, labels, or priority levels.
- Card comments or activity history.

## Decisions

- **Three fixed columns (BR-04):** The user asked for minimal features. Fixed columns (To Do / In Progress / Done) cover the classic Kanban flow without needing column management.
- **Browser-only storage (NFR-04):** Data is saved in the browser's local storage. This requires no backend, keeps the app simple, and means nothing leaves the user's device.
- **Optional description limited to 200 characters (BR-07):** A short description adds useful context without making the app complex. The 200-character limit keeps cards small and the UI clean.
