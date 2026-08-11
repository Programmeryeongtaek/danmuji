import { NextResponse } from 'next/server';

export async function GET() {
  const authKey = process.env.KOREAEXIM_AUTH_KEY;
  if (!authKey) {
    return NextResponse.json({ error: "환율 API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const today = new Date();

  for (let daysBack = 0; daysBack < 5; daysBack++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysBack);
    const searchDate = date.toISOString().slice(0, 10).replace(/-/g, "");

    const url = `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authKey}&searchdate=${searchDate}&data=AP01`;

    const res = await fetch(url);
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      const usd = data.find((item: { cur_unit: string }) => item.cur_unit === "USD");
      if (usd) {
        return NextResponse.json({
          rate: parseFloat(usd.deal_bas_r.replace(/,/g, "")),
          date: searchDate,
        });
      }
    }
  }

  return NextResponse.json({ error: "환율 정보를 찾을 수 없습니다." }, { status: 404 });
}