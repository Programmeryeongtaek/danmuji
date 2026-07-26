import { Sidebar } from '@/components/Sidebar';
import './globals.css';
import { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: '단무지 - 무지를 끊다',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-neutral-100 dark:bg-neutral-950">
        <Providers>
          <div className="mx-auto flex h-screen max-w-240 overflow-hidden rounded-none border-neutral-200 dark:border-neutral-800 sm:my-4 sm:h-[calc(100vh-2rem)] sm:rounded-xl sm:border">
            <Sidebar userName="사용자" />
            <main className="flex-1 overflow-y-auto bg-white p-6 dark:bg-neutral-900">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
