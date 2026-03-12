import express from "express";
import { z } from "zod";

import { menu } from "./mockData.js";
import { createOrderSchema } from "./validators.js";
import { createId, getOrder, nowIso, saveBill, saveKot, saveOrder } from "./store.js";

export const router = express.Router();

router.get("/menu", (_req, res) => {
  res.json({ ok: true, data: menu });
});

router.post("/orders", (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "ValidationError",
      details: parsed.error.flatten(),
    });
  }

  const body = parsed.data;
  const createdAt = nowIso();

  const menuById = new Map(menu.map((m) => [m.id, m]));
  const items = body.items.map((it) => {
    const m = menuById.get(it.menuItemId);
    return {
      id: createId(),
      menuItemId: it.menuItemId,
      nameSnapshot: m?.name ?? "Unknown item",
      unitPriceSnapshot: m?.price?.amount ?? 0,
      qty: it.qty,
      note: it.note,
    };
  });

  const order = saveOrder({
    id: createId(),
    type: body.type,
    tableOrSession: body.tableOrSession,
    status: "DRAFT",
    items,
    createdAt,
    updatedAt: createdAt,
  });

  return res.status(201).json({ ok: true, data: order });
});

router.get("/orders/:id", (req, res) => {
  const id = req.params.id;
  const order = getOrder(id);
  if (!order) {
    return res.status(404).json({ ok: false, error: "OrderNotFound" });
  }
  return res.json({ ok: true, data: order });
});

router.post("/orders/:id/kot", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ ok: false, error: "OrderNotFound" });
  }

  const createdAt = nowIso();
  const kot = saveKot({
    id: createId(),
    orderId: order.id,
    status: "CREATED",
    lines: order.items.map((it) => ({
      orderItemId: it.id,
      nameSnapshot: it.nameSnapshot,
      qty: it.qty,
      note: it.note,
    })),
    createdAt,
    updatedAt: createdAt,
  });

  return res.status(201).json({ ok: true, data: kot });
});

router.post("/orders/:id/bill", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ ok: false, error: "OrderNotFound" });
  }

  // Placeholder calculation rules (Phase 3 skeleton)
  const subtotal = order.items.reduce(
    (acc, it) => acc + it.unitPriceSnapshot * it.qty,
    0
  );
  const totals = {
    subtotal,
    discount: 0,
    tax: 0,
    total: subtotal,
  };

  const createdAt = nowIso();
  const bill = saveBill({
    id: createId(),
    orderId: order.id,
    status: "CREATED",
    totals,
    createdAt,
    updatedAt: createdAt,
  });

  return res.status(201).json({ ok: true, data: bill });
});

router.use((err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ ok: false, error: "ValidationError", details: err.flatten() });
  }
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ ok: false, error: "InternalError" });
});

