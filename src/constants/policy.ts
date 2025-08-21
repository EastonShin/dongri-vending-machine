import type { Currency } from "../types";

export const Policy = {
  card: { approvalRate: 0.95 },
  stock: { cola: 5, water: 5, coffee: 5 },
  cashBin: { 100: 10, 500: 10, 1000: 5, 5000: 2, 10000: 1 } as Record<
    Currency,
    number
  >,
  denominations: [10000, 5000, 1000, 500, 100] as const,
} as const;

export type Denomination = (typeof Policy.denominations)[number];
