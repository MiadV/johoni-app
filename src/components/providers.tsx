'use client';

import { SWRConfig } from 'swr';

import { fetcher } from '~/lib/axios';
import { ThemeProvider } from '~/components/theme-provider';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          shouldRetryOnError: false,
          fetcher: fetcher,
        }}
      >
        {children}
      </SWRConfig>
    </ThemeProvider>
  );
}

export default Providers;
