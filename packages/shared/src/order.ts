import type { Id } from "./ids";
import type { Timestamps } from "./timestamps";

export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

export type OrderStatus = "DRAFT" | "CONFIRMED" | "PAID" | "CANCELLED";

export type OrderItem = {
  id: Id;
  menuItemId: Id;
  nameSnapshot: string;
  unitPriceSnapshot: number;
  qty: number;
  note?: string;
};

export type Order = Timestamps & {
  id: Id;
  orderNumber?: string; // optional human-friendly sequence (server-defined later)
  type: OrderType;
  tableOrSession?: string;
  status: OrderStatus;
  items: OrderItem[];
};

