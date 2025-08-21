import { useReducer, useCallback } from "react";

import { Policy } from "../constants";
import type { Currency, DrinkId } from "../types";
import { reducer, createMachine } from "../machine/reducer";

export function useVendingMachine() {
  const [state, dispatch] = useReducer(reducer, undefined, createMachine);

  const select = useCallback(
    (drink: DrinkId) => dispatch({ type: "SELECT", drink }),
    []
  );

  const insertCash = useCallback(
    (amount: Currency) => dispatch({ type: "INSERT_CASH", amount }),
    []
  );

  const payByCard = useCallback(() => {
    dispatch({ type: "PAY_CARD_REQUEST" });
    const delay = 450 + Math.random() * 400;
    setTimeout(() => {
      const approved = Math.random() < Policy.card.approvalRate;
      dispatch({ type: "PAY_CARD_RESULT", approved });
    }, delay);
  }, []);

  const dispense = useCallback(() => dispatch({ type: "DISPENSE" }), []);
  const cancel = useCallback(() => dispatch({ type: "CANCEL" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const pushTray = useCallback(() => {
    dispatch({ type: "COLLECT" });
  }, []);

  return {
    state,
    actions: {
      select,
      insertCash,
      payByCard,
      dispense,
      cancel,
      reset,
      pushTray,
    },
  };
}
