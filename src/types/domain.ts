export type Currency = 100 | 500 | 1000 | 5000 | 10000;
export type DrinkId = "cola" | "water" | "coffee";
export type PayMethod = "cash" | "card";

export type UiState =
  | "idle"
  | "selected"
  | "paying"
  | "validating"
  | "dispensing"
  | "done"
  | "error"
  | "cancelled";

export interface Inventory {
  drinks: Record<DrinkId, number>;
  cashBin: Record<Currency, number>;
}

export interface Cart {
  selection?: DrinkId;
  inserted: number;
  payMethod?: PayMethod;
  message?: string;
  changeToDispense: Record<Currency, number>;
  dispensedDrink?: DrinkId;
  cancelled?: boolean;
}

export interface MachineState {
  inventory: Inventory;
  cart: Cart;
  state: UiState;
}
