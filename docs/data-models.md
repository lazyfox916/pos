## Data models (v0)

This document defines the **shared contracts** between `apps/web` and `apps/api`.

### ID strategy

- **Type**: ULID string (stored as plain `string`)
- **Generation**: client-first (offline-friendly); server should accept client IDs
- **Note**: human-friendly numbers (`orderNumber`, `kotNumber`, `billNumber`) are **server-defined later** and optional in v0.

### Timestamp policy

- **Format**: ISO-8601 UTC string (e.g., `2026-03-12T02:10:00.000Z`)
- **Source**:
  - v0/v1 offline-first: set by client
  - once server persistence is introduced: server becomes authoritative for `createdAt` / `updatedAt`

---

## Menu

### `MenuItem`

- **id**: ULID
- **name**: string
- **category**: string (recommended known set, but open-ended)
- **price**: `{ currency, amount }`
- **available**: boolean
- **createdAt / updatedAt**: ISO timestamps

---

## Orders

### `Order`

- **id**: ULID
- **type**: `DINE_IN | TAKEAWAY | DELIVERY`
- **tableOrSession**: string (optional; table name, token, etc.)
- **status**: `DRAFT | CONFIRMED | PAID | CANCELLED`
- **items**: `OrderItem[]`
- **orderNumber**: string (optional; server sequence later)
- **createdAt / updatedAt**: ISO timestamps

### `OrderItem`

- **id**: ULID
- **menuItemId**: ULID
- **nameSnapshot**: string (denormalized for stable receipts/KOTs)
- **unitPriceSnapshot**: number (denormalized)
- **qty**: number
- **note**: string (optional)

---

## KOT (Kitchen Order Ticket)

### `KOT`

- **id**: ULID
- **orderId**: ULID
- **status**: `CREATED | PRINTED | CANCELLED`
- **lines**: `KotLine[]`
- **kotNumber**: string (optional; server sequence later)
- **createdAt / updatedAt**: ISO timestamps

### `KotLine`

- **orderItemId**: ULID
- **nameSnapshot**: string
- **qty**: number
- **note**: string (optional)

---

## Bills

### `Bill`

- **id**: ULID
- **orderId**: ULID
- **status**: `CREATED | PAID | VOID`
- **totals**: `BillTotals`
- **payments**: `BillPayment[]` (optional; avoid sensitive details)
- **billNumber**: string (optional; server sequence later)
- **createdAt / updatedAt**: ISO timestamps

### `BillTotals`

- **subtotal**: number
- **discount**: number
- **tax**: number
- **total**: number

### `BillPayment`

- **method**: `CASH | CARD | UPI | SPLIT | OTHER`
- **amount**: number
- **reference**: string (optional; do not store card data)

