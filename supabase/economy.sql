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