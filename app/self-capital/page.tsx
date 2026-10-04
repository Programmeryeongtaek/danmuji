import SelfCapitalCheck from '@/components/self-capital/SelfCapitalCheck';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자기 자본 점검',
};

export default function SelfCapitalPage() {
  return <SelfCapitalCheck />;
}
