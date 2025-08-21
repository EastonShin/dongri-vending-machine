import type { Reducer } from "react";

import { DRINKS, UI_MSG, VMError } from "../constants";
import { makeChange, applyChange } from "./change";
import { initialCart, initialInventory } from "./state";
import type { Currency, DrinkId, MachineState } from "../types";

export type Event =
  | { type: "SELECT"; drink: DrinkId }
  | { type: "INSERT_CASH"; amount: Currency }
  | { type: "PAY_CARD_REQUEST" }
  | { type: "PAY_CARD_RESULT"; approved: boolean }
  | { type: "DISPENSE" }
  | { type: "CANCEL" }
  | { type: "COLLECT" }
  | { type: "RESET" };

export function createMachine(): MachineState {
  return { inventory: initialInventory(), cart: initialCart(), state: "idle" };
}

function performDispense(state: MachineState): MachineState {
  const id = state.cart.selection!;
  const price = DRINKS[id].price;

  if ((state.inventory.drinks[id] ?? 0) <= 0) {
    return {
      ...s,
      state: "error",
      cart: { ...s.cart, message: UI_MSG.error[VMError.OutOfStock] },
    };
  }

  if (state.cart.payMethod === "cash") {
    if (state.cart.inserted < price) {
      return {
        ...state,
        state: "error",
        cart: {
          ...state.cart,
          message: UI_MSG.error[VMError.InsufficientCash](
            price - state.cart.inserted
          ),
        },
      };
    }
    const changeAmt = state.cart.inserted - price;
    if (changeAmt > 0) {
      const { ok, change } = makeChange(changeAmt, state.inventory.cashBin);
      if (!ok)
        return {
          ...state,
          state: "error",
          cart: {
            ...state.cart,
            message: UI_MSG.error[VMError.ChangeShortage],
          },
        };
      const newCashBin = applyChange(change, state.inventory.cashBin, -1);
      return {
        ...state,
        state: "done",
        inventory: {
          ...state.inventory,
          drinks: {
            ...state.inventory.drinks,
            [id]: state.inventory.drinks[id] - 1,
          },
          cashBin: newCashBin,
        },
        cart: {
          ...state.cart,
          changeToDispense: change,
          dispensedDrink: id,
          message: UI_MSG.done,
        },
      };
    }
  }

  return {
    ...state,
    state: "done",
    inventory: {
      ...state.inventory,
      drinks: {
        ...state.inventory.drinks,
        [id]: state.inventory.drinks[id] - 1,
      },
      cashBin: state.inventory.cashBin,
    },
    cart: { ...state.cart, dispensedDrink: id, message: UI_MSG.done },
  };
}

export const reducer: Reducer<MachineState, Event> = (state, event) => {
  switch (event.type) {
    case "SELECT": {
      const id = event.drink;
      if ((state.inventory.drinks[id] ?? 0) <= 0) {
        return {
          ...state,
          state: "error",
          cart: { ...state.cart, message: UI_MSG.error[VMError.OutOfStock] },
        };
      }
      return {
        ...state,
        state: "selected",
        cart: { ...state.cart, selection: id, message: UI_MSG.selected(id) },
      };
    }

    case "INSERT_CASH": {
      if (!state.cart.selection) {
        return {
          ...state,
          state: "error",
          cart: { ...state.cart, message: UI_MSG.error[VMError.NotSelected] },
        };
      }
      const amt = event.amount;
      return {
        ...state,
        state: "paying",
        inventory: {
          ...state.inventory,
          cashBin: {
            ...state.inventory.cashBin,
            [amt]: (state.inventory.cashBin[amt] ?? 0) + 1,
          },
        },
        cart: {
          ...state.cart,
          payMethod: "cash",
          inserted: state.cart.inserted + amt,
          message: UI_MSG.paying(state.cart.inserted + amt),
        },
      };
    }

    case "PAY_CARD_REQUEST": {
      if (!state.cart.selection) {
        return {
          ...state,
          state: "error",
          cart: { ...state.cart, message: UI_MSG.error[VMError.NotSelected] },
        };
      }
      return {
        ...state,
        state: "validating",
        cart: { ...state.cart, payMethod: "card", message: UI_MSG.validating },
      };
    }

    case "PAY_CARD_RESULT": {
      if (!event.approved) {
        return {
          ...state,
          state: "error",
          cart: { ...state.cart, message: UI_MSG.error[VMError.CardDeclined] },
        };
      }
      const preState: MachineState = {
        ...state,
        state: "dispensing",
        cart: { ...state.cart, message: UI_MSG.dispensing },
      };
      return performDispense(preState);
    }

    case "DISPENSE": {
      return performDispense(state);
    }

    case "CANCEL": {
      if (state.cart.payMethod === "cash" && state.cart.inserted > 0) {
        const { ok, change } = makeChange(
          state.cart.inserted,
          state.inventory.cashBin
        );
        if (!ok) {
          return {
            ...state,
            state: "error",
            cart: {
              ...state.cart,
              message: UI_MSG.error[VMError.RefundFailed],
            },
          };
        }
        const newCashBin = applyChange(change, state.inventory.cashBin, -1);
        return {
          ...state,
          state: "cancelled",
          inventory: { ...state.inventory, cashBin: newCashBin },
          cart: {
            ...state.cart,
            changeToDispense: change,
            cancelled: true,
            message: UI_MSG.cancelled,
          },
        };
      }
      return {
        ...state,
        state: "cancelled",
        cart: { ...state.cart, cancelled: true, message: UI_MSG.cancelled },
      };
    }

    case "COLLECT": {
      if (state.state === "done" || state.state === "cancelled") {
        return {
          inventory: state.inventory,
          cart: initialCart(),
          state: "idle",
        };
      }
      return state;
    }

    case "RESET": {
      return {
        inventory: state.inventory,
        cart: initialCart(),
        state: "idle",
      };
    }
  }
};
