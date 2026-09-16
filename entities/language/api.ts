import { supabase } from '@/shared/lib/supabase';
import { RawSentenceRow, Sentence, SentenceInput, SentencePhrase, SituationTag, SituationTagWithCount } from '@/types/language';

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

// 태그별 사용 개수 포함 조회
export async function fetchSituationTagsWithCount (): Promise<SituationTagWithCount[]> {
  const [{ data: tags, error: tagsError }, { data: links, error: linksError }] = await Promise.all([
    supabase.from('situation_tags').select('*').order('name'),
    supabase.from('sentence_tags').select('tag_id'),
  ]);
  if (tagsError) throw tagsError;
  if (linksError) throw linksError;

  const countMap = new Map<string, number>();
  (links ?? []).forEach((l) => {
    countMap.set(l.tag_id, (countMap.get(l.tag_id) ?? 0) + 1);
  });

  return (tags ?? []).map((t) => ({ ...t, count: countMap.get(t.id) ?? 0 }));
}

// 태그명 변경 - 같은 이름의 다른 태그가 이미 있으면 병합
export async function renameSituationTag(
  id: string,
  newName: string
): Promise<{ merged: boolean }> {
  const trimmed = newName.trim();
  if (!trimmed) throw new Error('태그 이름을 입력해주세요.');

  const { data: existing, error: findError } = await supabase
    .from('situation_tags')
    .select('id')
    .eq('name', trimmed)
    .neq('id', id)
    .maybeSingle();
  if (findError) throw findError;

  if (existing) {
    // 병합: 이 태그가 있던 문장들을 대상 태그로 재연결 (중복 방지)
    const { data: myLinks, error: myLinksError } = await supabase
      .from('sentence_tags')
      .select('sentence_id')
      .eq('tag_id', id);
    if (myLinksError) throw myLinksError;

    if (myLinks && myLinks.length > 0) {
      const { data: targetLinks } = await supabase
        .from('sentence_tags')
        .select('sentence_id')
        .eq('tag_id', existing.id);
      const targetSet = new Set((targetLinks ?? []).map((l) => l.sentence_id));

      const toInsert = myLinks
        .filter((l) => !targetSet.has(l.sentence_id))
        .map((l) => ({ sentence_id: l.sentence_id, tag_id: existing.id }));

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from('sentence_tags').insert(toInsert);
        if (insertError) throw insertError;
      }
    }

    // 기존 태그 삭제
    const { error: deleteError } = await supabase.from('sentence_tags').delete().eq('id', id);
    if (deleteError) throw deleteError;

    return { merged: true };
  }

  const { error: updateError } = await supabase
    .from('situation_tags')
    .update({ name: trimmed })
    .eq('id', id);
  if (updateError) throw updateError;

  return { merged: false };
}

// 일괄 삭제 - cascade로 연결된 sentence_tags도 자동 삭제
export async function deleteSituationTag(ids: string[]): Promise<void> {
  const { error } = await supabase.from('situation_tags').delete().in('id', ids);
  if (error) throw error;
}