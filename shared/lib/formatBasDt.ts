export function formatBasDt(basDt: string) {
  return `${basDt.slice(0, 4)}.${basDt.slice(4, 6)}.${basDt.slice(6, 8)}`;
}