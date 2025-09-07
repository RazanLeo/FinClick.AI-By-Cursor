import React from 'react';
import Header from '@/components/layout/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, language, setLanguage }) => {
  return (
    <div className="min-h-screen bg-black text-gold">
      <Header language={language} setLanguage={setLanguage} />
      <main className="pt-20 px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
