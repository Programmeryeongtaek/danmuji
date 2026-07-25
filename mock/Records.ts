

// TODO: Supabase 연동 시 이 파일 대신 entities/quote, entities/thought,
// entities/saying 의 useQuotes / useThoughts / useSayings 훅으로 교체합니다.

import { Quote, RecordItem, Saying, Thought } from '@/types/Record';

export const MOCK_QUOTES: Quote[] = [
  {
    id: "quote-1",
    record_type: "quote",
    content: "습관은 반복이 아니라 정체성의 문제다.",
    book_title: "아주 작은 습관의 힘",
    author: "제임스 클리어",
    page_number: 42,
    tags: ["습관", "자기계발"],
    created_at: "2026-07-20T09:00:00Z",
  },
  {
    id: "quote-2",
    record_type: "quote",
    content:
      "돈이란 결국 자유를 사는 도구다. 사람들은 돈을 벌기 위해 시간을 쓰지만, 정작 돈이 주는 가장 큰 가치는 시간을 다시 사는 능력에 있다는 것을 잊는다. 부는 보이는 소비가 아니라 보이지 않는 선택지에서 나온다. 진짜 부자는 사고 싶은 것을 사는 사람이 아니라, 사고 싶지 않은 것을 사지 않아도 되는 사람이다.",
    book_title: "돈의 심리학",
    author: "모건 하우절",
    page_number: 18,
    tags: ["심리", "투자"],
    created_at: "2026-07-22T09:00:00Z",
  },
];

export const MOCK_THOUGHTS: Thought[] = [
  {
    id: "thought-1",
    record_type: "thought",
    content: "금리 인하 뉴스를 보고 채권 가격이 왜 반대로 움직이는지 다시 정리해봄.",
    tags: ["금리", "채권"],
    created_at: "2026-07-24T09:00:00Z",
  },
];

export const MOCK_SAYINGS: Saying[] = [
  {
    id: "saying-1",
    record_type: "saying",
    content: "시간을 지배하는 자가 인생을 지배한다.",
    source_person: "벤저민 프랭클린",
    tags: ["시간관리"],
    created_at: "2026-07-18T09:00:00Z",
  },
];

export function getMockRecordsFeed(): RecordItem[] {
  return [...MOCK_QUOTES, ...MOCK_THOUGHTS, ...MOCK_SAYINGS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}