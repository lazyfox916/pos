import { ulid } from "ulid";

/** In-memory store for Phase 3 skeleton (no DB). */
const orders = new Map(); // id -> order
const kots = new Map(); // id -> kot
const bills = new Map(); // id -> bill

export function nowIso() {
  return new Date().toISOString();
}

export function createId() {
  return ulid();
}

export function saveOrder(order) {
  orders.set(order.id, order);
  return order;
}

export function getOrder(id) {
  return orders.get(id) || null;
}

export function saveKot(kot) {
  kots.set(kot.id, kot);
  return kot;
}

export function saveBill(bill) {
  bills.set(bill.id, bill);
  return bill;
}

