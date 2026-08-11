export function externalEtfLink(ticker: string, market: "domestic" | "overseas"): string {
  if (market === "domestic") {
    return `https://finance.naver.com/item/main.naver?code=${ticker}`;
  }
  return `https://finance.yahoo.com/quote/${ticker}`;
}