import type { Id } from "./ids";
import type { Timestamps } from "./timestamps";

export type MenuCategory =
  | "Starters"
  | "Mains"
  | "Breads"
  | "Beverages"
  | "Desserts"
  | (string & {});

export type Money = {
  currency: "INR" | (string & {});
  amount: number; // decimal in major units for now
};

export type MenuItem = Timestamps & {
  id: Id;
  name: string;
  category: MenuCategory;
  price: Money;
  available: boolean;
};

