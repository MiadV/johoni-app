'use client';

import { useRouter } from 'next/navigation';
import { dashboardConfig } from '~/config/site';

import { useAuth } from '~/contexts/AuthContext';
import { LoadingSpinner } from '~/components/loading-spinner';
import { MainNav } from '~/components/main-nav';
import { DashboardNav } from '~/components/nav';
import { SiteFooter } from '~/components/site-footer';
import { UserAccountNav } from '~/components/user-account-nav';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (!user && !isLoading) {
    router.push('/login');
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav
            items={dashboardConfig.mainNav}
            mobileNavItems={dashboardConfig.sidebarNav}
          />
          <UserAccountNav
            user={{
              name: user.name,
              role: user.roles[0],
            }}
          />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
