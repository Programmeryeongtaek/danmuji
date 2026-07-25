import { RecordItem } from '@/types/Record';
import { atom } from 'jotai';

// 여러 기능(홈, 경제 키워드 등)에서 기록 상세 모달을 열 수 있으므로 전역 상태로 관리
export const selectedRecordAtom = atom<RecordItem | null>(null);