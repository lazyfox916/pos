import type { Id } from "./ids";
import type { Timestamps } from "./timestamps";

export type KotStatus = "CREATED" | "PRINTED" | "CANCELLED";

export type KotLine = {
  orderItemId: Id;
  nameSnapshot: string;
  qty: number;
  note?: string;
};

export type KOT = Timestamps & {
  id: Id;
  orderId: Id;
  kotNumber?: string; // optional human-friendly sequence (server-defined later)
  status: KotStatus;
  lines: KotLine[];
};

