'use client';

import { SWRConfig } from 'swr';

import { AuthProvider } from '~/contexts/AuthContext';
import fetchAPI from '~/lib/fetch';
import { ThemeProvider } from '~/components/theme-provider';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          shouldRetryOnError: false,
          fetcher: fetchAPI,
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}

export default Providers;
