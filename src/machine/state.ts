import { Policy } from "../constants";
import type { Cart, Inventory, Currency, DrinkId } from "../types";

/**
 * 잔돈 초기화
 * @returns 잔돈 초기화
 */
export function emptyChange(): Record<Currency, number> {
  return Policy.denominations.reduce(
    (acc, d) => ({ ...acc, [d]: 0 }),
    {} as Record<Currency, number>
  );
}

/**
 * 초기 인벤토리 설정
 * @returns 초기 인벤토리 설정
 */
export function initialInventory(): Inventory {
  return {
    drinks: {
      cola: Policy.stock.cola,
      water: Policy.stock.water,
      coffee: Policy.stock.coffee,
    } as Record<DrinkId, number>,
    cashBin: { ...Policy.cashBin },
  };
}

/**
 * 초기 카트 설정
 * @returns 초기 카트 설정
 */
export function initialCart(): Cart {
  return {
    inserted: 0,
    message: "제품을 선택하세요.",
    changeToDispense: emptyChange(),
    cancelled: false,
  };
}
