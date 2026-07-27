import { RecordTabKey } from '@/types/record';
import { atom } from 'jotai';

// records 페이지 안에서만 쓰이는 탭 선택 상태
export const activeRecordTabAtom = atom<RecordTabKey>('all');

// records 페이지 전용 검색어 (통합 검색과는 별개)
export const recordSearchQueryAtom = atom('');