import { supabase } from '@/shared/lib/supabase';
import { RawSentenceRow, Sentence, SentenceInput, SentencePhrase, SituationTag } from '@/types/language';

function mapRawSentence(row: RawSentenceRow): Sentence {
  const { sentence_tags, sentence_phrases, ...rest } = row;
  return {
    ...rest,
    tags: sentence_tags?.map((st) => st.situation_tags) ?? [],
    phrases: sentence_phrases ?? undefined,
  };
}

// 목록 조회 (태그 조인 포함)
export async function fetchSentences(): Promise<Sentence[]> {
  const { data, error } = await supabase
    .from('sentences_study')
    .select(`
      *,
      sentence_tags (
        situation_tags ( id, name, created_at )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as unknown as RawSentenceRow[] ?? []).map(mapRawSentence);
}

// 상세 조회 (숙어 포함)
export async function fetchSentenceById(id: string): Promise<Sentence> {
  const { data, error } = await supabase
    .from('sentences_study')
    .select(`
      *,
      sentence_tags ( situation_tags ( id, name, created_at ) ),
      sentence_phrases ( * )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  return mapRawSentence(data as unknown as RawSentenceRow);
}

// 생성
export async function createSentence(input: SentenceInput): Promise<Sentence> {
  const { tag_ids, ...sentenceFields } = input;

  const { data: sentence, error } = await supabase
    .from('sentences_study')
    .insert(sentenceFields)
    .select()
    .single();

  if (error) throw error;

  if (tag_ids && tag_ids.length > 0) {
    const rows = tag_ids.map((tag_id) => ({ sentence_id: sentence.id, tag_id }));
    const { error: tagError } = await supabase.from('sentence_tags').insert(rows);
    if (tagError) throw tagError;
  }

  return fetchSentenceById(sentence.id);
}

// 수정
export async function updateSentence(id: string, input: Partial<SentenceInput>): Promise<void> {
  const { tag_ids, ...fields } = input;

  const { error } = await supabase
    .from('sentences_study')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;

  if (tag_ids) {
    await supabase.from('sentence_tags').delete().eq('sentence_id', id);
    if (tag_ids.length > 0) {
      const rows = tag_ids.map((tag_id) => ({ sentence_id: id, tag_id }));
      const { error: tagError } = await supabase.from('sentence_tags').insert(rows);
      if (tagError) throw tagError;
    }
  }
}

// 삭제 (sentence_tags, sentence_phrases는 cascade로 자동 삭제)
export async function deleteSentence(id: string): Promise<void> {
  const { error } = await supabase.from('sentences_study').delete().eq('id', id);
  if (error) throw error;
}

// 학습필요/완료 토글
export async function toggleSentenceReview(id: string, isReviewed: boolean): Promise<void> {
  const { error } = await supabase
    .from('sentences_study')
    .update({ review_marked_at: isReviewed ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw error;
}

// 태그 전체 목록 (자동완성용)
export async function fetchSituationTags(): Promise<SituationTag[]> {
  const { data, error } = await supabase.from('situation_tags').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

// 태그 생성 (자동완성에서 새 태그 즉석 입력 시)
export async function createSituationTag(name: string): Promise<SituationTag> {
  const { data, error } = await supabase
    .from('situation_tags')
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 숙어 생성
export async function createSentencePhrase(
  sentence_id: string,
  language: 'en' | 'zh',
  phrase: string,
  meaning: string
): Promise<SentencePhrase> {
  const { data, error } = await supabase
    .from('sentence_phrases')
    .insert({ sentence_id, language, phrase, meaning })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 숙어 수정
export async function updateSentencePhrase(
  id: string,
  fields: Partial<Pick<SentencePhrase, 'phrase' | 'meaning' | 'memo'>>
): Promise<void> {
  const { error } = await supabase.from('sentence_phrases').update(fields).eq('id', id);
  if (error) throw error;
}

// 숙어 삭제
export async function deleteSentencePhrase(id: string): Promise<void> {
  const { error } = await supabase.from('sentence_phrases').delete().eq('id', id);
  if (error) throw error;
}

// 자동 추천용: 같은 language의 저장된 숙어 전체 (클라이언트에서 문자열 매칭)
export async function fetchPhrasesByLanguage(language: 'en' | 'zh'): Promise<SentencePhrase[]> {
  const { data, error } = await supabase
    .from('sentence_phrases')
    .select('*')
    .eq('language', language);
  if (error) throw error;
  return data ?? [];
}