-- 기준표
create table invest_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, -- TODO: auth 도입 시 not null
  name text not null,
  motto text,
  version int not null default 1,
  buy_threshold int not null default 75,
  watch_threshold int not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 기준 항목
create table invest_criteria (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references invest_templates(id) on delete cascade,
  category text not null,
  label text not null,
  kind text not null check (kind in ('bool', 'number', 'scale')),
  weight int not null default 1 check (weight > 0),
  is_required boolean not null default false,
  number_op text check (number_op in ('gte', 'lte')),
  number_target numeric,
  unit text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 기준표 변경 이력 (원칙의 변천)
create table invest_template_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references invest_templates(id) on delete cascade,
  version int not null,
  reason text,
  created_at timestamptz not null default now()
);

-- 종목
create table invest_stocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, -- TODO: auth 도입 시 not null
  name text not null,
  ticker text,
  market text,
  next_review_at date,
  created_at timestamptz not null default now()
);

-- 평가 기록
create table invest_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, -- TODO: auth 도입 시 not null
  stock_id uuid not null references invest_stocks(id) on delete cascade,
  template_id uuid references invest_templates(id) on delete set null,
  template_version int not null,
  evaluated_at timestamptz not null default now(),
  answers jsonb not null,
  score int not null check (score between 0 and 100),
  verdict text not null check (verdict in ('buy', 'watch', 'hold')),
  required_failed boolean not null default false,
  reason text,
  review_note text,
  reviewed_at timestamptz
);

create index on invest_criteria (template_id);
create index on invest_template_versions (template_id);
create index on invest_evaluations (stock_id, evaluated_at desc);

alter table invest_templates disable row level security;
alter table invest_criteria disable row level security;
alter table invest_template_versions disable row level security;
alter table invest_stocks disable row level security;
alter table invest_evaluations disable row level security;

-- 첫 기준표 하나 만들어두기 (항목은 앱에서 직접 추가)
insert into invest_templates (name) values ('나의 기본 원칙');