import type { Id } from "./ids";
import type { Timestamps } from "./timestamps";

export type PaymentMethod = "CASH" | "CARD" | "UPI" | "SPLIT" | "OTHER";

export type BillStatus = "CREATED" | "PAID" | "VOID";

export type BillTotals = {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

export type BillPayment = {
  method: PaymentMethod;
  amount: number;
  reference?: string; // e.g., UPI ref, last4, etc. (avoid sensitive data)
};

export type Bill = Timestamps & {
  id: Id;
  orderId: Id;
  billNumber?: string; // optional human-friendly sequence (server-defined later)
  status: BillStatus;
  totals: BillTotals;
  payments?: BillPayment[];
};

