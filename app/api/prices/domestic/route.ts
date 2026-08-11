import { DomesticEtfCandidate } from '@/types/etf';
import { NextResponse } from 'next/server';

export async function GET() {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "국내 시세 API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const today = new Date();

  for (let daysBack = 0; daysBack < 7; daysBack++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysBack);
    const basDt = date.toISOString().slice(0, 10).replace(/-/g, "");

    const url = `https://apis.data.go.kr/1160100/service/GetSecuritiesProductInfoService/getETFPriceInfo?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&resultType=json&basDt=${basDt}`;

    const res = await fetch(url);
    const data = await res.json();

    const items = data?.response?.body?.items?.item ?? [];

    if (items.length > 0) {
      const candidates: DomesticEtfCandidate[] = items.map(
        (item: Record<string, string>) => ({
          ticker: item.srtnCd,
          name: item.itmsNm,
          price: Number(item.clpr),
          changePercent: Number(item.fltRt),
          marketCap: Number(item.mrktTotAmt),
        })
      );

      candidates.sort((a, b) => b.marketCap - a.marketCap);

      return NextResponse.json({ items: candidates, date: basDt });
    }
  }

  return NextResponse.json({ error: "최근 시세 정보를 찾을 수 없습니다." }, { status: 404 });
}