import { RecordTabKey } from '@/types/record';
import { atom } from 'jotai';

// records 페이지 안에서만 쓰이는 탭 선택 상태
export const activeRecordTabAtom = atom<RecordTabKey>('all');