export const VMError = {
  OutOfStock: "OutOfStock",
  InsufficientCash: "InsufficientCash",
  ChangeShortage: "ChangeShortage",
  CardDeclined: "CardDeclined",
  RefundFailed: "RefundFailed",
  NotSelected: "NotSelected",
} as const;

export type VMError = (typeof VMError)[keyof typeof VMError];
