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