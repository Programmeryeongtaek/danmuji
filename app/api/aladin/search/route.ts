import { NextRequest, NextResponse } from 'next/server';

interface AladinSearchResult {
  title: string;
  author: string;
  publisher: string;
  summary: string;
  cover_url: string;
  isbn: string;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "검색어가 필요합니다." }, { status: 400 });
  }

  const ttbKey = process.env.ALADIN_TTB_KEY;
  if (!ttbKey) {
    return NextResponse.json({ error: "서버에 알라딘 API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(
    query
  )}&QueryType=Title&MaxResults=8&start=1&SearchTarget=Book&output=js&Version=20131101`;

  const res = await fetch(url);
  const data = await res.json();

  const items: AladinSearchResult[] = (data.item ?? []).map(
    (item: Record<string, string>) => ({
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      summary: item.description,
      cover_url: item.cover,
      isbn: item.isbn13,
    })
  );

  return NextResponse.json({ items });
}