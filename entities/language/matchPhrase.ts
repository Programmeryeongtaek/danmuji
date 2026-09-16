import { SentencePhrase } from '@/types/language';

export interface PhraseMatch {
  phrase: SentencePhrase;
  start: number;
  end: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 저장된 표현(phrase.phrase)의 앞/뒤 고정 단어가 text에 순서대로 등장하는지 찾음
// "put A off" 같은 템플릿은 A를 기준으로 앞/뒤를 분리해서 순서 매칭
// "keep an eye on" 같은 고정 표현은 통째로 매칭 (오탐 방지)
function findSingleMatch(
  text: string,
  template: string,
  language: 'en' | 'zh'
): { start: number; end: number } | null {
  const hasVariable = /\bA\b/.test(template);
  const boundary = language === 'en' ? '\\b' : ''; // 중국어는 띄어쓰기 경계가 없어 \b 미사용

  if (!hasVariable) {
    const re = new RegExp(`${boundary}${escapeRegExp(template)}${boundary}`, 'i');
    const m = re.exec(text);
    return m ? { start: m.index, end: m.index + m[0].length } : null;
  }

  const parts = template.split(/\bA\b/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const first = parts[0];
  const last = parts[parts.length - 1];

  const firstRe = new RegExp(`${boundary}${escapeRegExp(first)}${boundary}`, 'i');
  const firstMatch = firstRe.exec(text);
  if (!firstMatch) return null;

  const searchFrom = firstMatch.index + firstMatch[0].length;
  const lastRe = new RegExp(`${boundary}${escapeRegExp(last)}${boundary}`, 'i');
  const lastMatch = lastRe.exec(text.slice(searchFrom));
  if (!lastMatch) return null;

  return {
    start: firstMatch.index,
    end: searchFrom + lastMatch.index + lastMatch[0].length,
  };
}

// 겹치는 매칭은 먼저 찾은 것 우선, 뒤 매칭은 버림
export function findPhraseMatches(
  text: string,
  candidatePhrases: SentencePhrase[],
  language: 'en' | 'zh'
): PhraseMatch[] {
  const raw = candidatePhrases
    .map((phrase) => {
      const found = findSingleMatch(text, phrase.phrase, language);
      return found ? { phrase, ...found } : null;
    })
    .filter((m): m is PhraseMatch => m !== null)
    .sort((a, b) => a.start - b.start);

  const result: PhraseMatch[] = [];
  let lastEnd = -1;
  for (const m of raw) {
    if (m.start >= lastEnd) {
      result.push(m);
      lastEnd = m.end;
    }
  }
  return result;
}