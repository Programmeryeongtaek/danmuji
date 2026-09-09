-- 문장 (한국어 필수, 중국어/영어는 나중에 채워도 됨)
create table sentences_study (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null, -- TODO: auth 붙으면 not null로 전환
  korean_sentence text not null,
  chinese_sentence text,
  chinese_pinyin text,
  english_sentence text,
  memo text,
  review_marked_at timestamptz, -- null = 학습필요, 값 있음 = 완료
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 상황 태그 (재사용 전제, 정규화)
create table situation_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- 문장 - 태그 조인
create table sentence_tags (
  sentence_id uuid not null references sentences_study(id) on delete cascade,
  tag_id uuid not null references situation_tags(id) on delete cascade,
  primary key (sentence_id, tag_id)
);

-- 숙어/구동사 (문장에서 드래그로 추출)
create table sentence_phrases (
  id uuid primary key default gen_random_uuid(),
  sentence_id uuid not null references sentences_study(id) on delete cascade,
  language text not null check (language in ('en', 'zh')),
  phrase text not null, -- 예: "Put A off" 또는 "Keep an eye on"
  meaning text,
  memo text,
  review_marked_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS 비활성화 (1인 개발 단계)
alter table sentences_study disable row level security;
alter table situation_tags disable row level security;
alter table sentence_tags disable row level security;
alter table sentence_phrases disable row level security;

-- 자주 쓸 조회 인덱스
create index idx_sentence_tags_sentence on sentence_tags(sentence_id);
create index idx_sentence_tags_tag on sentence_tags(tag_id);
create index idx_sentence_phrases_sentence on sentence_phrases(sentence_id);