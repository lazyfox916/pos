# TODO — Kitchen POS (AI-friendly increments)

> Principles: ship tiny, keep it runnable, add security + docs continuously.  
> Target stack: Next.js (frontend), Express.js (API), MongoDB, Redis.  
> “Deployable early”: get a live hello-world as soon as possible.

---

## Phase 0 — Project initialization (smallest possible start)

- [ ] Create monorepo structure (e.g., `apps/web`, `apps/api`, `packages/shared`)
- [ ] Initialize git hygiene: `.gitignore`, `.editorconfig`, `.nvmrc` (or runtime pin)
- [ ] Add root `README.md` with how to run locally (even if only hello world)
- [ ] Add `docs/` index note in `README.md` pointing to PRD and TODO
- [ ] Add environment template files: `apps/api/.env.example`, `apps/web/.env.example`
- [ ] Security: document secrets policy (never commit `.env`, use `.env.example`)
- [ ] Security: pick an auth approach to start with (placeholder in docs, no code yet)
- [ ] Documentation: add `docs/architecture.md` skeleton (1 page max to start)

---

## Phase 1 — Hello world (deployable)

- [ ] Create Next.js app `apps/web` that renders “Kitchen POS — Hello”
- [ ] Create Express app `apps/api` with `/health` returning `{ ok: true }`
- [ ] Wire `apps/web` to call `apps/api/health` (server URL via env var)
- [ ] Add basic error handling: show “API unreachable” in UI when offline/unavailable
- [ ] Add minimal styling (clean, readable layout)
- [ ] Documentation: add `docs/runbook.md` with local run steps (web + api)
- [ ] Security: add baseline HTTP security headers on API (helmet or equivalent)
- [ ] Security: enable CORS with explicit origins (dev + prod placeholders)

### CI/CD early (right after hello world)

- [ ] Add GitHub Actions workflow: install, lint, typecheck, unit tests (can be empty at first)
- [ ] Add formatting: Prettier + ESLint config (web + api)
- [ ] Add commit hooks (optional): lint-staged + husky (keep it minimal)
- [ ] Add basic build pipelines: `web` build, `api` build/start checks
- [ ] Deploy “hello world”:
  - [ ] Deploy `apps/web` (e.g., Vercel/Netlify) with env var pointing to API
  - [ ] Deploy `apps/api` (e.g., Render/Fly/Railway) exposing `/health`
  - [ ] Documentation: `docs/deploy.md` with exact steps + env vars needed
- [ ] Security: ensure production uses HTTPS endpoints only (document + enforce where possible)

---

## Phase 2 — Basic UI + mocked data (no real backend yet)

### Menu & order builder (mocked)

- [ ] Create mocked menu data model (id, name, price, category, availability)
- [ ] Build menu screen: list/grid with category tabs/filters (mock data)
- [ ] Build “order container” panel showing selected items (mock state)
- [ ] Add drag-and-drop from menu item → order container (MVP)
- [ ] Add quantity controls (+/-) and remove item
- [ ] Add special instructions per line item (note field)
- [ ] Add order type selector: dine-in / takeaway / delivery (UI only)
- [ ] Add table/session identifier input (UI only; e.g., “Table 4”)

### Offline-first UX (mocked)

- [ ] Show connectivity indicator: Online / Offline (uses browser network status)
- [ ] Show sync indicator placeholder: Synced / Pending (mocked)

### Documentation & security (keep continuous)

- [ ] Documentation: update `docs/architecture.md` with current UI screens + state ownership
- [ ] Security: add a short threat model note in `docs/security.md` (v0: auth, offline data, sync)

---

## Phase 3 — Data models & API skeleton (real backend starts)

### Shared contracts

- [ ] Define shared types (MenuItem, Order, OrderItem, Bill, KOT) in `packages/shared`
- [ ] Decide IDs strategy (UUID/ULID) and timestamps policy (server vs client)
- [ ] Documentation: `docs/data-models.md` with entity fields and relationships

### API skeleton (no DB yet)

- [ ] Add API routes (return mock JSON at first):
  - [ ] `GET /menu`
  - [ ] `POST /orders`
  - [ ] `GET /orders/:id`
  - [ ] `POST /orders/:id/kot`
  - [ ] `POST /orders/:id/bill`
- [ ] Add request validation (zod/joi) for each POST route
- [ ] Security: add rate limiting baseline (Redis-ready, even if memory in dev)
- [ ] Documentation: `docs/api.md` with endpoints + example payloads

---

## Phase 4 — Persisted local-first orders (frontend persistence first)

### Local storage layer

- [ ] Implement local persistence for:
  - [ ] menu cache
  - [ ] draft orders
  - [ ] finalized orders
  - [ ] “outbox” pending sync events
- [ ] Choose storage mechanism for web (IndexedDB recommended) and implement a minimal wrapper
- [ ] Add “recover from refresh” behavior: reopen app and see existing draft order
- [ ] Security: decide what is safe to store locally (no secrets, avoid PII); document it
- [ ] Documentation: update `docs/architecture.md` with offline storage + outbox concept

### UI wired to local persistence

- [ ] Menu loads from local cache first, then refreshes when online
- [ ] Order builder reads/writes draft order to local storage
- [ ] Add “Confirm order” action that moves draft → finalized (still local)

---

## Phase 5 — MongoDB persistence (server) + basic sync (online mode)

### Database & server persistence

- [ ] Connect API to MongoDB (config + connection management)
- [ ] Implement MenuItem collection + seed endpoint/script (dev only)
- [ ] Implement Orders collection with status (draft/confirmed/paid/cancelled)
- [ ] Implement Bills + KOT records (or embed in order; decide and document)
- [ ] Security: sanitize inputs, enforce schema validation, avoid NoSQL injection patterns

### Sync v1 (simple, safe)

- [ ] Implement “push pending outbox” from client when online:
  - [ ] create order
  - [ ] update order items/notes
  - [ ] confirm order
- [ ] Implement server idempotency key support to avoid duplicates on retries
- [ ] Define conflict strategy (v1: last-write-wins per order field) and document it
- [ ] UI shows “Pending sync” count and last sync time

---

## Phase 6 — KOT generation (real)

- [ ] Define KOT format (fields, numbering scheme, timestamp)
- [ ] Create KOT from confirmed order (API + DB)
- [ ] UI: “Generate KOT” button and KOT preview screen
- [ ] Add print/export path for KOT (v1: browser print; later: thermal)
- [ ] Offline behavior: allow KOT generation offline (local) and sync later
- [ ] Documentation: update `docs/api.md` and `docs/data-models.md` for KOT
- [ ] Security: ensure only authorized roles can generate/print KOTs (RBAC placeholder)

---

## Phase 7 — Bill generation (real)

- [ ] Define bill calculation rules (subtotal, tax, discount, total rounding) in shared package
- [ ] Implement tax configuration (simple global rate v1)
- [ ] Implement discounts (fixed + percentage) with optional reason
- [ ] Generate bill record from order (API + DB)
- [ ] UI: bill preview with totals breakdown
- [ ] Print/export bill (v1: browser print / PDF)
- [ ] Offline: bill generation works offline and syncs later (outbox event)
- [ ] Security: avoid storing sensitive payment data; document what is stored

---

## Phase 8 — Advanced POS basics (incremental)

### Order types & tables

- [ ] Add table/session management (v1: simple “Table X” string; later: full table map)
- [ ] Add order type persistence and filtering

### Payments (v1)

- [ ] Add payment method selection (cash/card/UPI)
- [ ] Add “mark as paid” flow with receipt number
- [ ] Add split payment (smallest: 2-way split with amounts)
- [ ] Add transaction history list (local-first, then server)
- [ ] Security: add audit fields (who marked paid, when) and immutable payment records

---

## Phase 9 — Authentication & authorization (minimal then expand)

- [ ] Implement auth v1 (email+password or PIN-based staff accounts; choose and document)
- [ ] Add roles: owner, staff
- [ ] Protect API routes with auth middleware
- [ ] UI: login screen + session handling
- [ ] Security: password hashing (bcrypt/argon2), secure cookies/JWT strategy documented
- [ ] Security: add basic account lockout / throttling
- [ ] Documentation: update `docs/security.md` with auth + RBAC decisions

---

## Phase 10 — Observability & reliability (early but minimal)

- [ ] Add structured logging in API (request id, route, latency)
- [ ] Add client error reporting strategy (v1: console + local log view)
- [ ] Add health checks for Mongo + Redis connectivity
- [ ] Add simple retry/backoff for sync
- [ ] Documentation: `docs/ops.md` with logs and common failures (offline/sync)

---

## Phase 11 — Testing after core features (start small, expand)

### Unit tests (shared + api)

- [ ] Unit test bill calculations (tax/discount/rounding)
- [ ] Unit test idempotency handling / dedupe logic (API)
- [ ] Unit test validation schemas (happy + bad paths)

### Frontend tests

- [ ] Component tests: drag-and-drop adds item to order container
- [ ] Component tests: quantity changes and item removal
- [ ] Offline tests: draft order persists across reload

### Integration tests

- [ ] API integration: create order → generate KOT → generate bill
- [ ] Sync integration: offline outbox → reconnect → server has final state

### CI improvements

- [ ] Run tests in CI (including integration tests with ephemeral Mongo/Redis containers)
- [ ] Add coverage reporting thresholds (start low, raise later)

---

## Phase 12 — Harden security continuously (checklist items to sprinkle in)

- [ ] Add input validation everywhere (client + server)
- [ ] Add authorization checks for all write actions (owner vs staff)
- [ ] Add CSRF protection strategy (if cookie-based auth)
- [ ] Add secure headers and content security policy (CSP) for web
- [ ] Add dependency scanning (CI) and keep dependencies patched
- [ ] Document offline data risk and mitigation (device access, encryption considerations)

---

## Phase 13 — Documentation continuously (definition of done)

- [ ] Every new endpoint updates `docs/api.md`
- [ ] Every new data entity updates `docs/data-models.md`
- [ ] Every new security decision updates `docs/security.md`
- [ ] Every deploy/config change updates `docs/deploy.md`
- [ ] Keep `docs/TODO.md` current (split tasks further when they feel too big)

