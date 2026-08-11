import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "해외 시세 API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  if (!ticker) {
    return NextResponse.json({ error: "ticker가 필요합니다." }, { status: 400 });
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.c === undefined) {
    return NextResponse.json({ error: "시세 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    ticker,
    price: data.c,
    changePercent: data.dp,
  });
}