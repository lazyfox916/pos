## Architecture (v0)

### Goal

Build an offline-first Kitchen POS:

- The UI must continue operating without internet.
- Data is stored locally and synced when connectivity returns.

### High-level components

- **Web app** (`apps/web`): Next.js UI (PWA-friendly)
- **API** (`apps/api`): Express REST API for sync + server-side persistence
- **Database**: MongoDB for canonical data (menu, orders, bills, users)
- **Redis**: caching, rate limiting, and (future) sync queue primitives

### Offline-first concept (planned)

- **Local store**: IndexedDB (or equivalent) holds menu cache, draft orders, finalized orders, and an outbox of pending mutations.
- **Outbox**: write actions enqueue an event; sync loop pushes events when online.
- **Conflict strategy**: v1 likely last-write-wins per entity field, refined later.

### Phase 2 (current) — Mocked UI

In Phase 2, the web app contains a **mocked menu + order builder** with no real persistence yet:

- **Menu**: categories + grid of items (mock data)
- **Order builder**:
  - add items via **drag-and-drop** or “Add” button
  - adjust quantities and remove items
  - per-line special instruction (note)
  - order type + table/session identifier (UI only)
- **Connectivity + sync**:
  - Online/Offline indicator from browser network status
  - “Synced/Pending” sync indicator (mocked; becomes real once outbox + API sync is implemented)

