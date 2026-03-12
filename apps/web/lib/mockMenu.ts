export type MenuCategory =
  | "Starters"
  | "Mains"
  | "Breads"
  | "Beverages"
  | "Desserts";

export type MenuItem = {
  id: string;
  name: string;
  price: number; // in INR for now
  category: MenuCategory;
  available: boolean;
};

export const MOCK_MENU: MenuItem[] = [
  {
    id: "itm_paneer_tikka",
    name: "Paneer Tikka",
    price: 220,
    category: "Starters",
    available: true,
  },
  {
    id: "itm_veg_spring_rolls",
    name: "Veg Spring Rolls",
    price: 180,
    category: "Starters",
    available: true,
  },
  {
    id: "itm_butter_paneer",
    name: "Paneer Butter Masala",
    price: 280,
    category: "Mains",
    available: true,
  },
  {
    id: "itm_dal_tadka",
    name: "Dal Tadka",
    price: 190,
    category: "Mains",
    available: true,
  },
  {
    id: "itm_jeera_rice",
    name: "Jeera Rice",
    price: 140,
    category: "Mains",
    available: true,
  },
  {
    id: "itm_tandoori_roti",
    name: "Tandoori Roti",
    price: 25,
    category: "Breads",
    available: true,
  },
  {
    id: "itm_butter_naan",
    name: "Butter Naan",
    price: 45,
    category: "Breads",
    available: true,
  },
  {
    id: "itm_masala_chai",
    name: "Masala Chai",
    price: 40,
    category: "Beverages",
    available: true,
  },
  {
    id: "itm_coke",
    name: "Coke",
    price: 60,
    category: "Beverages",
    available: true,
  },
  {
    id: "itm_gulab_jamun",
    name: "Gulab Jamun",
    price: 90,
    category: "Desserts",
    available: true,
  },
];

