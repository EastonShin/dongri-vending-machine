import { DRINKS } from "./catalog";
import { VMError } from "./errors";

export const UI_MSG = {
  idle: "제품을 선택하세요.",
  selected: (id: keyof typeof DRINKS) =>
    `선택: ${DRINKS[id].name}. 결제 수단을 선택하세요.`,
  paying: (sum: number) => `투입금액: ${sum.toLocaleString()}원`,
  validating: "결제 승인 중…",
  dispensing: "상품을 배출합니다.",
  done: "감사합니다! 상품과 거스름돈을 수령하세요.",
  cancelled: "거래가 취소되었습니다.",
  error: {
    [VMError.OutOfStock]: "해당 상품은 품절입니다.",
    [VMError.InsufficientCash]: (need: number) =>
      `투입금액 부족: ${need.toLocaleString()}원이 더 필요합니다.`,
    [VMError.ChangeShortage]:
      "거스름돈 부족: 다른 수단을 사용하거나 다른 상품을 선택하세요.",
    [VMError.CardDeclined]:
      "카드 결제 실패 (한도/네트워크). 다른 수단을 시도하세요.",
    [VMError.RefundFailed]: "환불 오류: 거스름돈 부족. 관리자 호출.",
    [VMError.NotSelected]: "먼저 상품을 선택하세요.",
  },
} as const;
