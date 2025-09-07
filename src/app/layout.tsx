import '@/styles/globals.css';
import Providers from './providers';

export const metadata = {
  title: 'FinClick.AI — Revolutionary Intelligent Financial Analysis Platform',
  description: 'منصة التحليل المالي الذكي والثوري — ثورة في عالم التحليل المالي',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


