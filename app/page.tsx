// TODO: 아래 더미 데이터는 이후 useNewsSummaries / useThoughts / useBookSummaries

import { SummaryCardView } from '@/components/SummaryCard';
import { SummaryCard } from '@/types/Dashboard';

// (TanStack Query + Supabase) 훅으로 교체합니다.
const CARDS: SummaryCard[] = [
  {
    key: 'news',
    title: '오늘의 뉴스 요약',
    icon: 'news',
    moreHref: '/economy/news',
    items: [
      { title: '연준, 기준금리 동결', href: '/economy/news/1' },
      { title: '삼성전자 2분기 영업이익 10조 돌파', href: '/economy/news/2' },
      { title: '환율, 장중 1,370원 돌파', href: '/economy/news/3' },
    ],
  },
  {
    key: 'thoughts',
    title: '최근 생각 기록',
    icon: 'pencil',
    moreHref: '/records/thoughts',
    items: [
      { title: '금리 인하와 채권 가격의 관계', href: '/records/thoughts/1' },
      { title: '인플레이션이 체감되는 순간들', href: '/records/thoughts/2' },
      { title: 'SOXX는 미국 반도체 ETF다', href: '/records/thoughts/3' },
    ],
  },
  {
    key: 'books',
    title: '도서 소개',
    icon: 'book',
    moreHref: '/economy/books',
    items: [
      { title: '부의 인문학', href: '/economy/books/1' },
      { title: '돈의 심리학', href: '/economy/books/2' },
      { title: '경제학 콘서트', href: '/economy/books/3' },
    ],
  },
];

export default function Home() {
  return (
    <div>
      {/* 문구 영역: 높이(h-11)는 검색 히어로 자리와 동일하게 유지 */}
      <div className="flex h-11 items-center justify-center">
        <p className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
          오늘은 무엇을{' '}
          <span className="text-amber-600 dark:text-amber-400">쌓아</span>
          볼까요?
        </p>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-3">
        {CARDS.map((card) => (
          <SummaryCardView key={card.key} card={card} />
        ))}
      </div>
    </div>
  );
}
