import { RecordType } from '@/types/Record';
import { atom } from 'jotai';

// 홈 화면 등 다른 곳에서도 "새 기록 추가"를 트리거할 수 있으므로 전역 상태로 관리
export const isRecordFormOpenAtom = atom(false);
export const recordFormTypeAtom = atom<RecordType>("quote");