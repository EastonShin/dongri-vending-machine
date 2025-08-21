/**
 * 화폐 단위 포맷팅
 * @param n 화폐 단위
 * @returns 화폐 단위 포맷팅
 */
export function toKrw(n: number) {
  return `₩${n.toLocaleString()}`;
}
