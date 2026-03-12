## Security (v0)

### Secrets policy

- Do not commit `.env` files.
- Store only templates as `.env.example`.
- Rotate any secret that is accidentally committed.

### Authentication (placeholder)

Not implemented yet. When introduced, decide:

- session vs JWT
- password vs PIN (staff-friendly)
- roles: owner, staff

### Offline data (placeholder)

Offline-first implies local storage of operational data. v0 stance:

- avoid storing secrets locally
- minimize PII stored on the client
- document what is stored locally as features are added

### Threat model notes (v0)

This is a lightweight initial threat model to keep decisions explicit early.

- **Auth & session risks**
  - Risks: weak passwords/PINs, credential stuffing, session theft.
  - Mitigations (planned): strong hashing (bcrypt/argon2), rate limiting + lockout, secure cookie/JWT strategy, RBAC (owner vs staff).

- **Offline data risks**
  - Risks: device compromise exposes locally stored orders/bills/notes; shared devices leak data across users.
  - Mitigations (planned): store minimal PII, avoid storing secrets, add “logout clears local session”, consider local encryption if threat warrants it.

- **Sync risks**
  - Risks: replay/duplicate mutations, tampering, conflict corruption, man-in-the-middle on insecure networks.
  - Mitigations (planned): HTTPS-only, auth on sync endpoints, idempotency keys, request validation, audit fields, conflict strategy documented (v1 likely last-write-wins).

