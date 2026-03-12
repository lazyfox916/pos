import { z } from "zod";

export const orderTypeSchema = z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]);

export const createOrderSchema = z.object({
  type: orderTypeSchema,
  tableOrSession: z.string().trim().min(1).max(64).optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        qty: z.number().int().min(1).max(99),
        note: z.string().trim().max(140).optional(),
      })
    )
    .min(1),
});

