## Runbook (local development)

### Prerequisites

- Node.js (see `.nvmrc`)
- npm

### Setup

- Copy env templates:
  - `apps/api/.env.example` → `apps/api/.env`
  - `apps/web/.env.example` → `apps/web/.env.local`

### Install dependencies (from repo root)

```bash
npm install
```

### Run web + api together

```bash
npm run dev
```

### Individual apps

- API:

```bash
npm run dev --workspace apps/api
```

- Web:

```bash
npm run dev --workspace apps/web
```

### Smoke test

- API health should return `{ ok: true }` at `http://localhost:4000/health`
- Web should render “Kitchen POS — Hello” on the port Next.js picks (usually `http://localhost:3000`) and show API status

