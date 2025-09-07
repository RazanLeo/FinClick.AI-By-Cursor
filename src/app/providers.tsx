'use client';

import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AnalysisProvider } from '@/contexts/AnalysisContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <AnalysisProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#000000',
                    color: '#D4AF37',
                    border: '1px solid #D4AF37',
                  },
                  success: { iconTheme: { primary: '#10B981', secondary: '#000000' } },
                  error: { iconTheme: { primary: '#EF4444', secondary: '#000000' } },
                }}
              />
            </AnalysisProvider>
          </AuthProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}


