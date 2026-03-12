## API (Phase 3 skeleton)

Base URL (local): `http://localhost:4000`

All responses are JSON.

---

## Health

### `GET /health`

Response:

```json
{ "ok": true }
```

---

## Menu

### `GET /menu`

Returns mocked menu items (no DB).

Response:

```json
{
  "ok": true,
  "data": [
    {
      "id": "itm_paneer_tikka",
      "name": "Paneer Tikka",
      "category": "Starters",
      "price": { "currency": "INR", "amount": 220 },
      "available": true
    }
  ]
}
```

---

## Orders

### `POST /orders`

Creates an order (in-memory; resets on server restart).

Request body:

```json
{
  "type": "DINE_IN",
  "tableOrSession": "Table 4",
  "items": [
    { "menuItemId": "itm_paneer_tikka", "qty": 1, "note": "extra spicy" },
    { "menuItemId": "itm_butter_naan", "qty": 4 }
  ]
}
```

Response (201):

```json
{
  "ok": true,
  "data": {
    "id": "01JNFY9S7J4Q1C3G0X9K8D0D1A",
    "type": "DINE_IN",
    "tableOrSession": "Table 4",
    "status": "DRAFT",
    "items": [
      {
        "id": "01JNFY9S9Z6H9PSZ2WQ8T2JH2S",
        "menuItemId": "itm_paneer_tikka",
        "nameSnapshot": "Paneer Tikka",
        "unitPriceSnapshot": 220,
        "qty": 1,
        "note": "extra spicy"
      }
    ],
    "createdAt": "2026-03-12T02:10:00.000Z",
    "updatedAt": "2026-03-12T02:10:00.000Z"
  }
}
```

Validation errors return `400` with `error: "ValidationError"`.

### `GET /orders/:id`

Returns an order by id.

Response (200):

```json
{ "ok": true, "data": { "id": "...", "items": [] } }
```

Response (404):

```json
{ "ok": false, "error": "OrderNotFound" }
```

---

## KOT

### `POST /orders/:id/kot`

Creates a KOT from the order (mocked; in-memory).

Response (201):

```json
{
  "ok": true,
  "data": {
    "id": "01JNFY9T0B3Q2B3H7VY8H0B5PZ",
    "orderId": "01JNFY9S7J4Q1C3G0X9K8D0D1A",
    "status": "CREATED",
    "lines": [{ "orderItemId": "...", "nameSnapshot": "Paneer Tikka", "qty": 1 }],
    "createdAt": "2026-03-12T02:10:05.000Z",
    "updatedAt": "2026-03-12T02:10:05.000Z"
  }
}
```

---

## Bills

### `POST /orders/:id/bill`

Creates a bill for the order (mocked totals: no tax/discount yet).

Response (201):

```json
{
  "ok": true,
  "data": {
    "id": "01JNFY9T5KJZ6M6A0Z2J1D3Q4R",
    "orderId": "01JNFY9S7J4Q1C3G0X9K8D0D1A",
    "status": "CREATED",
    "totals": { "subtotal": 220, "discount": 0, "tax": 0, "total": 220 },
    "createdAt": "2026-03-12T02:10:10.000Z",
    "updatedAt": "2026-03-12T02:10:10.000Z"
  }
}
```

