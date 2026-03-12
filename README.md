## Kitchen POS & Restaurant Management System

Offline-first POS + kitchen ops for small/mid restaurants.

### Repo structure

- `apps/web`: Next.js frontend (planned)
- `apps/api`: Express.js API (planned)
- `packages/shared`: shared types/utilities (planned)
- `docs/`: PRD, TODO, architecture notes

### Documentation

- `docs/requirements.md`: product requirements (PRD)
- `docs/TODO.md`: build plan in small phases
- `docs/architecture.md`: evolving technical overview
- `docs/runbook.md`: how to run locally (to be filled after Phase 1)
- `docs/security.md`: secrets + baseline security decisions

### Secrets policy

- Never commit real secrets.
- Copy `apps/api/.env.example` → `apps/api/.env` and `apps/web/.env.example` → `apps/web/.env.local` for local dev.

