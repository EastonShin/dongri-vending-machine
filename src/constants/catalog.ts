import type { DrinkId } from "../types";

export const DRINKS: Record<DrinkId, { name: string; price: number }> = {
  cola: { name: "콜라", price: 1100 },
  water: { name: "물", price: 600 },
  coffee: { name: "커피", price: 700 },
} as const;
