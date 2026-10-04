import ItemManager from '@/components/self-capital/ItemManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자기 자본 점검 · 문항 관리',
};

export default function SelfCapitalItemsPage() {
  return <ItemManager />;
}
