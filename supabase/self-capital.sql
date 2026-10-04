-- 자기 자본 점검 (나라는 자본)
-- 기준 틀: 도리스 메르틴 『아비투스』의 일곱 가지 자본
-- 문항(items) / 월별 점검(checks) / 점검별 점수(scores)

create table if not exists self_capital_items (
  id uuid primary key default gen_random_uuid(),
  capital text not null check (capital in (
    'psychological', 'cultural', 'knowledge', 'economic',
    'physical', 'linguistic', 'social'
  )),
  content text not null,
  sort_order int not null default 0,
  is_active boolean not null default true, -- 문항은 지우지 말고 비활성화 (과거 기록 보존)
  user_id uuid null, -- TODO(auth): 회원별 문항
  created_at timestamptz not null default now()
);

create table if not exists self_capital_checks (
  id uuid primary key default gen_random_uuid(),
  period text not null check (period ~ '^\d{4}-\d{2}$'),  -- 'YYYY-MM', 한 달에 한 번
  memo text,
  user_id uuid null,                         -- TODO(auth)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 같은 달 점검은 하나만. TODO(auth): (user_id, period) 복합 유니크로 교체
create unique index if not exists self_capital_checks_period_key
  on self_capital_checks (period);

create table if not exists self_capital_scores (
  check_id uuid not null references self_capital_checks(id) on delete cascade,
  item_id uuid not null references self_capital_items(id) on delete restrict,
  score smallint not null check (score between 1 and 10), -- 1~5로 할지 고민
  primary key (check_id, item_id)
);

alter table self_capital_items disable row level security;
alter table self_capital_checks disable row level security;
alter table self_capital_scores disable row level security;