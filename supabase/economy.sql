create table book_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  title text not null,
  author text,
  summary text not null,
  status text check (status in ('reading', 'done')) default 'reading',
  tags text[],
  created_at timestamptz default now()
);

create table book_chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references book_summaries not null,
  chapter_order int not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

create table content_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  source_type text not null,   -- 'chapter' | 'keyword' | 'news' | 'etf'
  source_id uuid not null,
  target_type text not null,
  target_id uuid not null,
  note text,
  created_at timestamptz default now()
);

create index on book_chapters (book_id);
create index on content_links (source_type, source_id);
create index on content_links (target_type, target_id);

alter table book_summaries
  add column isbn text,
  add column cover_url text;

alter table book_chapters
drop constraint book_chapters_book_id_fkey,
add constraint book_chapters_book_id_fkey
  foreign key (book_id) references book_summaries(id) on delete cascade;

alter table book_summaries disable row level security;
alter table book_chapters disable row level security;
alter table content_links disable row level security;

------ 블로그 3번째 개발일지
create table economic_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  term text not null,
  definition text not null,
  status text check (status in ('new', 'review', 'done')) default 'new',
  category text,
  created_at timestamptz default now()
);

alter table economic_keywords disable row level security;

alter table content_links
  add column relation_kind text check (relation_kind in ('related', 'prerequisite', 'derived'));

-- 스토리지 작업 book-covers
create policy "Allow anonymous uploads to book-covers"
on storage.objects for insert
to anon
with check (bucket_id = 'book-covers');

create policy "Allow public read on book-covers"
on storage.objects for select
to anon
using (bucket_id = 'book-covers');

-- 출판사 정보
alter table book_summaries
  add column publisher text;

-- 알라딘 출처 표시
alter table book_summaries
  add column aladin_link text;

-- 도서 소감 필드 추가
alter table book_summaries
  add column reflection text;

-- ISBN 중복 방지
update book_summaries
set isbn = null
where isbn = '';

create unique index book_summaries_isbn_unique
  on book_summaries (isbn)
  where isbn is not null;

-- etf
create table etfs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  ticker text not null,
  market text check (market in ('domestic', 'overseas')) not null,
  name text not null,
  tags text[],
  created_at timestamptz default now()
);

alter table etfs disable row level security;

create unique index etfs_ticker_market_unique
  on etfs (ticker, market);

-- 뉴스요약
create table news_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  title text not null,
  source text,
  summary text not null,
  article_url text,
  published_date date,
  created_at timestamptz default now()
);

alter table news_summaries disable row level security;
