import { KeywordStatus } from '@/types/keyword';
import { atom } from 'jotai';

export type KeywordFilter = 'all' | KeywordStatus;

export const keywordFilterAtom = atom<KeywordFilter>('all');