-- 문장
create table quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  book_title text not null,
  author text not null,
  page_number int,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 생각
create table thoughts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 명언
create table sayings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  source_person text not null,
  context text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- '전체' 탭용 통합 뷰
create view records_feed as
  select
    id, user_id, 'quote' as record_type, content,
    book_title as subtitle, author as detail, page_number,
    null as source_person, null as context,
    tags, created_at
  from quotes
  union all
  select
    id, user_id, 'thought' as record_type, content,
    null, null, null,
    null, null,
    tags, created_at
  from thoughts
  union all
  select
    id, user_id, 'saying' as record_type, content,
    source_person as subtitle, context as detail, null,
    source_person, context,
    tags, created_at
  from sayings;

-- RLS 활성화 (뷰는 원본 테이블 정책을 그대로 따름)
alter table quotes enable row level security;
alter table thoughts enable row level security;
alter table sayings enable row level security;

create policy "user can manage own quotes"
  on quotes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user can manage own thoughts"
  on thoughts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user can manage own sayings"
  on sayings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
--
--   -- 로그인 기능 해제
-- alter table quotes alter column user_id drop not null;
-- alter table thoughts alter column user_id drop not null;
-- alter table sayings alter column user_id drop not null;

-- alter table quotes disable row level security;
-- alter table thoughts disable row level security;
-- alter table sayings disable row level security;