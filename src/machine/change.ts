import { Policy } from "../constants";
import type { Currency } from "../types";

/**
 * 잔돈 생성
 * @param amount 잔돈 금액
 * @param cashBin 현재 현금 출입구
 * @returns 잔돈 생성 결과
 */
export function makeChange(
  amount: number,
  cashBin: Record<Currency, number>
): { ok: boolean; change: Record<Currency, number> } {
  const change = Policy.denominations.reduce(
    (acc, d) => ({ ...acc, [d]: 0 }),
    {} as Record<Currency, number>
  );

  let remaining = amount;

  for (const d of [...Policy.denominations].sort((a, b) => b - a)) {
    const need = Math.floor(remaining / d);
    const give = Math.min(need, cashBin[d] || 0);
    if (give > 0) {
      change[d] = give;
      remaining -= give * d;
    }
  }

  return { ok: remaining === 0, change };
}

/**
 * 잔돈 적용
 * @param delta 잔돈 변동
 * @param cashBin 현재 현금 출입구
 * @param sign 잔돈 적용 방향
 */
export function applyChange(
  delta: Record<Currency, number>,
  cashBin: Record<Currency, number>,
  sign: 1 | -1
): Record<Currency, number> {
  const out: Record<Currency, number> = { ...cashBin };

  for (const d of Policy.denominations) {
    out[d] = (out[d] ?? 0) + sign * (delta[d] ?? 0);
  }

  return out;
}
