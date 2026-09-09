export interface SituationTag {
  id: string;
  name: string;
  created_at: string;
}

export interface SentencePhrase {
  id: string;
  sentence_id: string;
  language: 'en' | 'zh';
  phrase: string;
  meaning: string | null;
  memo: string | null;
  review_marked_at: string | null;
  created_at: string;
}

export interface Sentence {
  id: string;
  user_id: string | null;
  korean_sentence: string;
  chinese_sentence: string | null;
  chinese_pinyin: string | null;
  english_sentence: string | null;
  memo: string | null;
  review_marked_at: string | null;
  created_at: string;
  updated_at: string;
  tags: SituationTag[]; // 조인 결과로 채워진다.
  phrases?: SentencePhrase[]; // 상세 페이지에서만 필요 시 로드
}

export interface SentenceInput {
  korean_sentence: string;
  chinese_sentence?: string | null;
  chinese_pinyin?: string | null;
  english_sentence?: string | null;
  memo?: string | null;
  tag_ids?: string[];
}

// Supabase 조인 쿼리의 raw 응답 타입 (내부용)
export interface SentenceTagJoinRow {
  situation_tags: SituationTag;
}

export interface RawSentenceRow
  extends Omit<Sentence, 'tags' | 'phrases'> {
  sentence_tags: SentenceTagJoinRow[] | null;
  sentence_phrases?: SentencePhrase[] | null;
}