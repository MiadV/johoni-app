import './globals.css';

import { Inter } from 'next/font/google';
import { siteConfig } from '~/config/site';

import { cn } from '~/lib/utils';
import Providers from '~/components/providers';
import { TailwindIndicator } from '~/components/tailwind-indicator';
import { Toaster } from '~/components/ui/toaster';
import type { Metadata } from 'next';

export const dynamic = 'error';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className,
        )}
      >
        <Providers>
          {children}
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
